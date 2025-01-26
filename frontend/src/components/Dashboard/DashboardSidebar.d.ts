interface SidebarProps {
    currentFeature: string;
    setCurrentFeature: (feature: string) => void;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (isOpen: boolean) => void;
}
export declare const DashboardSidebar: ({ currentFeature, setCurrentFeature, isMobileMenuOpen, setIsMobileMenuOpen, }: SidebarProps) => import("react/jsx-runtime").JSX.Element;
export {};
