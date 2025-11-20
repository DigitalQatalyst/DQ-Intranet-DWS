import React from "react";
import clsx from "clsx";

interface DiscoverDQSectionWrapperProps extends React.HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements;
}

const DiscoverDQSectionWrapper: React.FC<DiscoverDQSectionWrapperProps> = ({
  as: Component = "section",
  className,
  children,
  ...rest
}) => {
  return (
    <Component
      className={clsx("mx-auto max-w-6xl px-4 sm:px-6 lg:px-8", className)}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default DiscoverDQSectionWrapper;
