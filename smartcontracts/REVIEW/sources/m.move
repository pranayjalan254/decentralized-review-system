module addr::review2 {
    use std::string::{String, utf8};
    use aptos_framework::event;
    use aptos_framework::account;
    use aptos_framework::timestamp;
    use std::signer;
    use aptos_std::table::{Self, Table};

    // Error codes
    const E_INVALID_RATING: u64 = 1;
    const E_NOT_INITIALIZED: u64 = 2;
    const E_NOT_OWNER: u64 = 3;
    const OWNER_ADDRESS: address = @0xf42b36821c33c1fe60d1cb08a7e386cff3b5d5332b24824e676648baa554e485;

    // Represents a single review
    struct Review has store, drop, copy {
        reviewer: address,
        establishment_name: String,
        establishment_type: String,
        rating: u8,
        comment: String,
        timestamp: u64,
    }

    // Struct to store all reviews for an establishment
    struct EstablishmentReviews has store {
        reviews: Table<u64, Review>,
        review_count: u64,
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
        establishment_type: String,
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
            });
        };
        
        let establishment_reviews = table::borrow_mut(&mut review_store.reviews_by_establishment, establishment_name);
        
        // Create the review with reviewer_address instead of signer's address
        let review = Review {
            reviewer: reviewer_address,
            establishment_name,
            establishment_type,
            rating,
            comment,
            timestamp: timestamp::now_microseconds(),
        };
        
        // Add review to the table
        table::add(&mut establishment_reviews.reviews, establishment_reviews.review_count, review);
        establishment_reviews.review_count = establishment_reviews.review_count + 1;
        
        // Emit review event
        event::emit_event(&mut review_store.review_event, review);
    }

    // Get the number of reviews for an establishment
    #[view]
    public fun get_review_count(addr: address, establishment_name: String): u64 acquires ReviewStore {
        assert!(exists<ReviewStore>(addr), E_NOT_INITIALIZED);
        let review_store = borrow_global<ReviewStore>(addr);
        if (!table::contains(&review_store.reviews_by_establishment, establishment_name)) {
            return 0
        };
        let establishment_reviews = table::borrow(&review_store.reviews_by_establishment, establishment_name);
        establishment_reviews.review_count
    }

    #[test_only]
    use std::string;
    use std::debug;
    use std::vector;

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

    #[test(framework = @aptos_framework, owner = @0xf42b36821c33c1fe60d1cb08a7e386cff3b5d5332b24824e676648baa554e485, reviewer = @0x1)]
    public entry fun test_query_reviews(
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
        let restaurant_name = string::utf8(b"Tasty Restaurant");
        let gym_name = string::utf8(b"Power Gym");

        // Add restaurant reviews
        submit_review(
            &owner,
            reviewer_addr,
            copy restaurant_name,
            string::utf8(b"Restaurant"),
            5,
            string::utf8(b"Amazing food!")
        );

        submit_review(
            &owner,
            reviewer_addr,
            copy restaurant_name,
            string::utf8(b"Restaurant"),
            4,
            string::utf8(b"Good but expensive")
        );

        // Add gym review
        submit_review(
            &owner,
            reviewer_addr,
            copy gym_name,
            string::utf8(b"Gym"),
            5,
            string::utf8(b"Great equipment")
        );

        // Print all reviews data
        debug::print(&string::utf8(b"=== Query Test Results ==="));

        // 1. Get and verify restaurant review count
        let restaurant_count = get_review_count(owner_addr, copy restaurant_name);
        debug::print(&string::utf8(b"Restaurant review count:"));
        debug::print(&restaurant_count);
        assert!(restaurant_count == 2, 1);

        // 2. Get and verify gym review count
        let gym_count = get_review_count(owner_addr, copy gym_name);
        debug::print(&string::utf8(b"Gym review count:"));
        debug::print(&gym_count);
        assert!(gym_count == 1, 2);

        // 3. Query specific reviews
        debug::print(&string::utf8(b"=== Restaurant Reviews ==="));
        let i = 0;
        while (i < restaurant_count) {
            let review = get_review(owner_addr, copy restaurant_name, i);
            debug::print(&string::utf8(b"Review #"));
            debug::print(&i);
            debug::print(&string::utf8(b"Rating:"));
            debug::print(&review.rating);
            debug::print(&string::utf8(b"Comment:"));
            debug::print(&review.comment);
            i = i + 1;
        };

        debug::print(&string::utf8(b"=== Gym Reviews ==="));
        let review = get_review(owner_addr, copy gym_name, 0);
        debug::print(&string::utf8(b"Rating:"));
        debug::print(&review.rating);
        debug::print(&string::utf8(b"Comment:"));
        debug::print(&review.comment);

        // 4. Verify review details
        let first_restaurant_review = get_review(owner_addr, copy restaurant_name, 0);
        assert!(first_restaurant_review.rating == 5, 3);
        assert!(first_restaurant_review.reviewer == reviewer_addr, 4);

        let gym_review = get_review(owner_addr, copy gym_name, 0);
        assert!(gym_review.rating == 5, 5);
        assert!(string::utf8(b"Great equipment") == gym_review.comment, 6);
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
            string::utf8(b"Test Type"),
            5,
            string::utf8(b"Test comment")
        );
    }
}