import { Link } from "react-router-dom";

export function Footer() {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Doubts", href: "/doubts" },
    { name: "Quizzes", href: "/quizzes" },
  ];

  return (
    <footer className="w-full bg-background text-muted-foreground py-6 mt-8 border-t border-muted-foreground/20">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <nav className="flex space-x-6">
          {quickLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-sm hover:text-foreground transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} vab_tut. Support:{" "}
          <a
            href="mailto:vabtut@gmail.com"
            className="text-primary hover:underline"
          >
            vabtut@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
}
