interface InfoCardProps {
  variant?: "success" | "info" | "error";
  children: React.ReactNode;
}

const variantStyles: Record<NonNullable<InfoCardProps["variant"]>, string> = {
  success: "bg-success text-success",
  info: "bg-info text-main",
  error: "bg-danger text-danger",
};

const InfoCard = ({ children, variant = "info" }: InfoCardProps) => {
  return (
    <div
      className={`${variantStyles[variant]} glow backdrop-blur-lg rounded-sm shadow-2xl border-color overflow-hidden mb-8`}
    >
      <div className="p-4 gap-3">{children}</div>
    </div>
  );
};

export default InfoCard;
