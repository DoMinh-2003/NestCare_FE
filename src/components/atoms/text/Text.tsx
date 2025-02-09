interface TextProps {
    className?: string;
    children: React.ReactNode;
  }
  
  const Text: React.FC<TextProps> = ({ className, children }) => {
    return <p className={`cursor-pointer ${className}`}>{children}</p>;
  };
  
  export default Text;
  