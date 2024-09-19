interface AuthLayoutPageProps {
  children: React.ReactNode;
}
const AuthLayoutPage = ({ children }: AuthLayoutPageProps) => {
  return (
    <div className="flex size-full items-center justify-center">{children}</div>
  );
};

export default AuthLayoutPage;
