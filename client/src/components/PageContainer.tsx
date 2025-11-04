interface PageContainerProps {
    children: React.ReactNode;
    className?: string;
    noPaddingTop?: boolean;
}

export default function PageContainer({
    children,
    className = '',
    noPaddingTop = false
}: PageContainerProps) {
    return (
        <div className={`mx-auto px-4 sm:px-6 lg:px-14 ${noPaddingTop ? '' : 'pt-32'} ${className}`}>
            {children}
        </div>
    );
}
