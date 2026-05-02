const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-[var(--color-border)] ${className}`}
      {...props}
    />
  );
};

export default Skeleton;
