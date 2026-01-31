"use client";

interface OrderStatusTabsProps {
  activeStatus: string;
  onStatusChange: (status: string) => void;
}

export function OrderStatusTabs({
  activeStatus,
  onStatusChange,
}: OrderStatusTabsProps) {
  const statuses = [
    { id: "preparing", label: "Preparing" },
    { id: "on_the_way", label: "On the Way" },
    { id: "delivered", label: "Delivered" },
    { id: "done", label: "Done" },
    { id: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto">
      <span className="shrink-0 text-sm font-bold leading-7 tracking-[-0.28px] text-gray-950">
        Status
      </span>
      {statuses.map((status) => {
        const isActive = status.id === activeStatus;

        return (
          <button
            key={status.id}
            onClick={() => onStatusChange(status.id)}
            className={`h-10 shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold leading-7 tracking-[-0.28px] transition-colors ${
              isActive
                ? "border-primary-600 bg-primary-600 text-white"
                : "border-gray-300 bg-transparent text-gray-950 hover:bg-gray-100"
            }`}
          >
            {status.label}
          </button>
        );
      })}
    </div>
  );
}
