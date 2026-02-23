interface InfoSectionProps {
    label: string;
    value: string | React.ReactNode;
}

export default function InfoSection({ label, value }: InfoSectionProps) {
    return (
        <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {label}
            </dt>
            <dd className="text-gray-900 dark:text-white">
                {value}
            </dd>
        </div>
    );
}
