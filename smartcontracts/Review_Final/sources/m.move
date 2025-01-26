module addr::review2 {
    use std::string::{String, utf8};
    use aptos_framework::event;
    use aptos_framework::account;
    use aptos_framework::timestamp;
    use std::signer;
    use aptos_std::table::{Self, Table};
    use std::vector;

    // Error codes
    const E_INVALID_RATING: u64 = 1;
    const E_NOT_INITIALIZED: u64 = 2;
    const E_NOT_OWNER: u64 = 3;
    const E_ESTABLISHMENT_NOT_FOUND: u64 = 4;
    const E_REVIEW_ALREADY_EXISTS: u64 = 5;
    const OWNER_ADDRESS: address = @0xf42b36821c33c1fe60d1cb08a7e386cff3b5d5332b24824e676648baa554e485;

    // Represents a single review
    struct Review has store, drop, copy {
        reviewer: address,
        establishment_name: String,
        rating: u8,
        comment: String,
        timestamp: u64,
    }

    // Struct to store all reviews for an establishment
    struct EstablishmentReviews has store {
        reviews: Table<u64, Review>,
        review_count: u64,
        total_rating: u64, // For calculating average
        // Table to track reviewers for this establishment
        reviewers: Table<address, bool>,
    }

    // Resource struct to store all reviews by establishment
    struct ReviewStore has key {
        reviews_by_establishment: Table<String, EstablishmentReviews>,
        review_event: event::EventHandle<Review>,
    }

    // Initialize the review store for an account
    public entry fun initialize(account: &signer) {
        let addr = signer::address_of(account);
        if (!exists<ReviewStore>(addr)) {
            move_to(account, ReviewStore {
                reviews_by_establishment: table::new(),
                review_event: account::new_event_handle<Review>(account),
            });
        }
    }

    // Submit a review
    public entry fun submit_review(
        owner: &signer,
        reviewer_address: address,
        establishment_name: String,
        rating: u8,
        comment: String
    ) acquires ReviewStore {
        // Validate that the transaction is from the owner
        let owner_addr = signer::address_of(owner);
        assert!(owner_addr == OWNER_ADDRESS, E_NOT_OWNER);

        // Validate rating is between 1 and 5
        assert!(rating > 0 && rating <= 5, E_INVALID_RATING);

        assert!(exists<ReviewStore>(owner_addr), E_NOT_INITIALIZED);

        let review_store = borrow_global_mut<ReviewStore>(owner_addr);

        // If this is the first review for this establishment, initialize its review store
        if (!table::contains(&review_store.reviews_by_establishment, establishment_name)) {
            table::add(&mut review_store.reviews_by_establishment, establishment_name, EstablishmentReviews {
                reviews: table::new(),
                review_count: 0,
                total_rating: 0,
                reviewers: table::new(),
            });
        };

        let establishment_reviews = table::borrow_mut(&mut review_store.reviews_by_establishment, establishment_name);

        // Check if the reviewer has already reviewed this establishment
        assert!(!table::contains(&establishment_reviews.reviewers, reviewer_address), E_REVIEW_ALREADY_EXISTS);

        // Create the review with reviewer_address instead of signer's address
        let review = Review {
            reviewer: reviewer_address,
            establishment_name,
            rating,
            comment,
            timestamp: timestamp::now_microseconds(),
        };

        // Add review to the table
        table::add(&mut establishment_reviews.reviews, establishment_reviews.review_count, review);

        // Update review count and total rating
        establishment_reviews.review_count = establishment_reviews.review_count + 1;
        establishment_reviews.total_rating = establishment_reviews.total_rating + (rating as u64);

        // Add the reviewer to the reviewers table
        table::add(&mut establishment_reviews.reviewers, reviewer_address, true);

        // Emit review event
        event::emit_event(&mut review_store.review_event, review);
    }

    // Get the number of reviews for an establishment
    #[view]
    public fun get_review_count(addr: address, establishment_name: String): u64 acquires ReviewStore {
        assert!(exists<ReviewStore>(addr), E_NOT_INITIALIZED);
        let review_store = borrow_global<ReviewStore>(addr);
        if (!table::contains(&review_store.reviews_by_establishment, establishment_name)) {
            return 0;
        };
        let establishment_reviews = table::borrow(&review_store.reviews_by_establishment, establishment_name);
        establishment_reviews.review_count
    }

    // Get all reviews for an establishment
    #[view]
    public fun get_all_reviews(addr: address, establishment_name: String): vector<Review> acquires ReviewStore {
        assert!(exists<ReviewStore>(addr), E_NOT_INITIALIZED);
        let review_store = borrow_global<ReviewStore>(addr);

        // Check if the establishment exists
        assert!(
            table::contains(&review_store.reviews_by_establishment, establishment_name),
            E_ESTABLISHMENT_NOT_FOUND
        );

        let establishment_reviews = table::borrow(&review_store.reviews_by_establishment, establishment_name);
        let review_count = establishment_reviews.review_count;
        let reviews = vector::empty<Review>();
        let i = 0;
        while (i < review_count) {
            vector::push_back(&mut reviews, *table::borrow(&establishment_reviews.reviews, i));
            i = i + 1;
        };
        reviews
    }

    // Get the average rating of an establishment
    #[view]
    public fun get_average_rating(addr: address, establishment_name: String): u64 acquires ReviewStore {
        assert!(exists<ReviewStore>(addr), E_NOT_INITIALIZED);
        let review_store = borrow_global<ReviewStore>(addr);
        if (!table::contains(&review_store.reviews_by_establishment, establishment_name)) {
            return 0; // Or handle the case where there are no reviews (e.g., return a special value)
        };
        let establishment_reviews = table::borrow(&review_store.reviews_by_establishment, establishment_name);
        if (establishment_reviews.review_count == 0) {
            return 0; // Avoid division by zero if there are no reviews
        };
        establishment_reviews.total_rating / establishment_reviews.review_count
    }

    #[test_only]
    use std::string;
    use std::debug;
    

    #[test_only]
    // Helper function to get a specific review
    public fun get_review(
        addr: address,
        establishment_name: String,
        review_index: u64
    ): Review acquires ReviewStore {
        let review_store = borrow_global<ReviewStore>(addr);
        let establishment_reviews = table::borrow(&review_store.reviews_by_establishment, establishment_name);
        *table::borrow(&establishment_reviews.reviews, review_index)
    }

    #[test(framework = @aptos_framework, owner = @0xf42b36821c33c1fe60d1cb08a7e386cff3b5d5332b24824e676648baa554e485, reviewer1 = @0x1, reviewer2 = @0x2)]
    public entry fun test_query_reviews(
        framework: signer,
        owner: signer,
        reviewer1: signer,
        reviewer2: signer
    ) acquires ReviewStore {
        // Setup
        timestamp::set_time_has_started_for_testing(&framework);
        let owner_addr = signer::address_of(&owner);
        let reviewer1_addr = signer::address_of(&reviewer1);
        let reviewer2_addr = signer::address_of(&reviewer2);

        account::create_account_for_test(owner_addr);
        account::create_account_for_test(reviewer1_addr);
        account::create_account_for_test(reviewer2_addr);
        initialize(&owner);

        // Add test data
        let establishment1_name = string::utf8(b"Establishment 1");
        let establishment2_name = string::utf8(b"Establishment 2");

        // Add reviews using different reviewer addresses
        submit_review(
            &owner,
            reviewer1_addr,
            copy establishment1_name,
            5,
            string::utf8(b"Amazing place!")
        );

        submit_review(
            &owner,
            reviewer2_addr,
            copy establishment1_name,
            4,
            string::utf8(b"Good overall")
        );

        // Add review for another establishment
        submit_review(
            &owner,
            reviewer1_addr,
            copy establishment2_name,
            5,
            string::utf8(b"Great experience")
        );

        // Print all reviews data
        debug::print(&string::utf8(b"=== Query Test Results ==="));

        // 1. Get and verify establishment 1 review count
        let establishment1_count = get_review_count(owner_addr, copy establishment1_name);
        debug::print(&string::utf8(b"Establishment 1 review count:"));
        debug::print(&establishment1_count);
        assert!(establishment1_count == 2, 1);

        // 2. Get and verify establishment 2 review count
        let establishment2_count = get_review_count(owner_addr, copy establishment2_name);
        debug::print(&string::utf8(b"Establishment 2 review count:"));
        debug::print(&establishment2_count);
        assert!(establishment2_count == 1, 2);

        // 3. Query specific reviews
        debug::print(&string::utf8(b"=== Establishment 1 Reviews ==="));
        let i = 0;
        while (i < establishment1_count) {
            let review = get_review(owner_addr, copy establishment1_name, i);
            debug::print(&string::utf8(b"Review #"));
            debug::print(&i);
            debug::print(&string::utf8(b"Rating:"));
            debug::print(&review.rating);
            debug::print(&string::utf8(b"Comment:"));
            debug::print(&review.comment);
            i = i + 1;
        };

        debug::print(&string::utf8(b"=== Establishment 2 Reviews ==="));
        let review = get_review(owner_addr, copy establishment2_name, 0);
        debug::print(&string::utf8(b"Rating:"));
        debug::print(&review.rating);
        debug::print(&string::utf8(b"Comment:"));
        debug::print(&review.comment);

        // 4. Verify review details
        let first_establishment1_review = get_review(owner_addr, copy establishment1_name, 0);
        assert!(first_establishment1_review.rating == 5, 3);
        assert!(first_establishment1_review.reviewer == reviewer1_addr, 4);

        let establishment2_review = get_review(owner_addr, copy establishment2_name, 0);
        assert!(establishment2_review.rating == 5, 5);
        assert!(string::utf8(b"Great experience") == establishment2_review.comment, 6);
    }

    #[test(framework = @aptos_framework, owner = @0xf42b36821c33c1fe60d1cb08a7e386cff3b5d5332b24824e676648baa554e485, reviewer = @0x1)]
    #[expected_failure(abort_code = E_NOT_INITIALIZED)]
    public entry fun test_query_nonexistent_review(
        framework: signer,
        owner: signer,
        reviewer: signer
    ) acquires ReviewStore {
        timestamp::set_time_has_started_for_testing(&framework);
        let owner_addr = signer::address_of(&owner);
        account::create_account_for_test(owner_addr);
        // Don't initialize the review store

        // This should fail because the ReviewStore isn't initialized
        let _count = get_review_count(owner_addr, string::utf8(b"Any Place"));
    }

    #[test(framework = @aptos_framework, owner = @0x5f9027cf5f971d8a08a51beb9d2b97b455586c93b5006f7318e7c60651d44a0e, reviewer = @0x1)]
    public entry fun test_query_empty_establishment(
        framework: signer,
        owner: signer,
        reviewer: signer
    ) acquires ReviewStore {
        timestamp::set_time_has_started_for_testing(&framework);
        let owner_addr = signer::address_of(&owner);
        account::create_account_for_test(owner_addr);
        initialize(&owner);

        // This should return 0 for non-existent establishment
        let count = get_review_count(owner_addr, string::utf8(b"Nonexistent Place"));
        assert!(count == 0, 1);
    }

    // Add new test for unauthorized submission
    #[test(framework = @aptos_framework, unauthorized = @0x2, reviewer = @0x1)]
    #[expected_failure(abort_code = E_NOT_OWNER)]
    public entry fun test_unauthorized_submission(
        framework: signer,
        unauthorized: signer,
        reviewer: signer
    ) acquires ReviewStore {
        timestamp::set_time_has_started_for_testing(&framework);
        let unauthorized_addr = signer::address_of(&unauthorized);
        let reviewer_addr = signer::address_of(&reviewer);

        account::create_account_for_test(unauthorized_addr);
        account::create_account_for_test(reviewer_addr);
        initialize(&unauthorized);

        // This should fail because the sender is not the owner
        submit_review(
            &unauthorized,
            reviewer_addr,
            string::utf8(b"Test Place"),
            5,
            string::utf8(b"Test comment")
        );
    }

    #[test(framework = @aptos_framework, owner = @0xf42b36821c33c1fe60d1cb08a7e386cff3b5d5332b24824e676648baa554e485, reviewer1 = @0x1, reviewer2 = @0x2)]
    public entry fun test_get_all_reviews(
        framework: signer,
        owner: signer,
        reviewer1: signer,
        reviewer2: signer
    ) acquires ReviewStore {
        // Setup
        timestamp::set_time_has_started_for_testing(&framework);
        let owner_addr = signer::address_of(&owner);
        let reviewer1_addr = signer::address_of(&reviewer1);
        let reviewer2_addr = signer::address_of(&reviewer2);

        account::create_account_for_test(owner_addr);
        account::create_account_for_test(reviewer1_addr);
        account::create_account_for_test(reviewer2_addr);
        initialize(&owner);

        // Add test data
        let establishment_name = string::utf8(b"Test Establishment");

        // Add reviews using different reviewer addresses
        submit_review(
            &owner,
            reviewer1_addr,
            copy establishment_name,
            5,
            string::utf8(b"Amazing place!")
        );

        submit_review(
            &owner,
            reviewer2_addr,
            copy establishment_name,
            4,
            string::utf8(b"Good overall")
        );

        // Get all reviews for the establishment
        let all_reviews = get_all_reviews(owner_addr, copy establishment_name);

        // Verify the number of reviews
        assert!(vector::length(&all_reviews) == 2, 1);

        // Verify the details of the first review
        let first_review = vector::borrow(&all_reviews, 0);
        assert!(first_review.rating == 5, 2);
        assert!(first_review.reviewer == reviewer1_addr, 3);
        assert!(string::utf8(b"Amazing place!") == first_review.comment, 4);

        // Verify the details of the second review
        let second_review = vector::borrow(&all_reviews, 1);
        assert!(second_review.rating == 4, 5);
        assert!(second_review.reviewer == reviewer2_addr, 6);
        assert!(string::utf8(b"Good overall") == second_review.comment, 7);
    }

    #[test(framework = @aptos_framework, owner = @0xf42b36821c33c1fe60d1cb08a7e386cff3b5d5332b24824e676648baa554e485)]
    #[expected_failure(abort_code = E_ESTABLISHMENT_NOT_FOUND)]
    public entry fun test_get_all_reviews_nonexistent_establishment(
        framework: signer,
        owner: signer
    ) acquires ReviewStore {
        // Setup
        timestamp::set_time_has_started_for_testing(&framework);
        let owner_addr = signer::address_of(&owner);

        account::create_account_for_test(owner_addr);
        initialize(&owner);

        // Attempt to get reviews for a nonexistent establishment
        let _all_reviews = get_all_reviews(owner_addr, string::utf8(b"Nonexistent Place"));
    }

    #[test(framework = @aptos_framework, owner = @0xf42b36821c33c1fe60d1cb08a7e386cff3b5d5332b24824e676648baa554e485, reviewer = @0x1)]
    #[expected_failure(abort_code = E_REVIEW_ALREADY_EXISTS)]
    public entry fun test_duplicate_review(
        framework: signer,
        owner: signer,
        reviewer: signer
    ) acquires ReviewStore {
        // Setup
        timestamp::set_time_has_started_for_testing(&framework);
        let owner_addr = signer::address_of(&owner);
        let reviewer_addr = signer::address_of(&reviewer);

        account::create_account_for_test(owner_addr);
        account::create_account_for_test(reviewer_addr);
        initialize(&owner);

        // Add test data
        let establishment_name = string::utf8(b"Test Establishment");

        // Add a review
        submit_review(
            &owner,
            reviewer_addr,
            copy establishment_name,
            5,
            string::utf8(b"Amazing place!")
        );

        // Attempt to add another review with the same reviewer for the same establishment
        submit_review(
            &owner,
            reviewer_addr,
            copy establishment_name,
            4,
            string::utf8(b"This is a duplicate review")
        );
    }

    #[test(framework = @aptos_framework, owner = @0xf42b36821c33c1fe60d1cb08a7e386cff3b5d5332b24824e676648baa554e485, reviewer1 = @0x1, reviewer2 = @0x2)]
    public entry fun test_get_average_rating(
        framework: signer,
        owner: signer,
        reviewer1: signer,
        reviewer2: signer
    ) acquires ReviewStore {
        // Setup
        timestamp::set_time_has_started_for_testing(&framework);
        let owner_addr = signer::address_of(&owner);
        let reviewer1_addr = signer::address_of(&reviewer1);
        let reviewer2_addr = signer::address_of(&reviewer2);

        account::create_account_for_test(owner_addr);
        account::create_account_for_test(reviewer1_addr);
        account::create_account_for_test(reviewer2_addr);
        initialize(&owner);

        // Add test data
        let establishment_name = string::utf8(b"Test Establishment");

        // Add reviews for the establishment using different reviewer addresses
        submit_review(
            &owner,
            reviewer1_addr,
            copy establishment_name,
            4,
            string::utf8(b"Good")
        );

        submit_review(
            &owner,
            reviewer2_addr,
            copy establishment_name,
            5,
            string::utf8(b"Excellent")
        );

        // Get the average rating
        let avg_rating = get_average_rating(owner_addr, copy establishment_name);

        // Verify the average rating (should be (4+5)/2 = 4.5, but since it's u64, it will be 4)
        assert!(avg_rating == 4, 1);

        // Test with no reviews
        let establishment_name_no_reviews = string::utf8(b"Establishment with No Reviews");
        let avg_rating_no_reviews = get_average_rating(owner_addr, copy establishment_name_no_reviews);
        assert!(avg_rating_no_reviews == 0, 2); // Should be 0 (or whatever default value you choose)
    }
}