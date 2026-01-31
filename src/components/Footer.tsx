import Image from "next/image";
import Link from "next/link";

const exploreLinks = [
  { name: "All Food", href: "#" },
  { name: "Nearby", href: "#" },
  { name: "Discount", href: "#" },
  { name: "Best Seller", href: "#" },
  { name: "Delivery", href: "#" },
  { name: "Lunch", href: "#" },
];

const helpLinks = [
  { name: "How to Order", href: "#" },
  { name: "Payment Methods", href: "#" },
  { name: "Track My Order", href: "#" },
  { name: "FAQ", href: "#" },
  { name: "Contact Us", href: "#" },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-gray-300 bg-gray-950 px-8 py-20 lg:px-30">
      <div className="mx-auto flex max-w-300 flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-0">
        {/* Brand Section */}
        <div className="flex w-full max-w-95 flex-col gap-10">
          {/* Logo & Description */}
          <div className="flex flex-col gap-5.5">
            <Link href="/" className="flex items-center gap-3.75">
              <div className="relative h-10.5 w-10.5">
                <Image
                  src="/images/foody-logo.svg"
                  alt="Foody Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-[32px] font-extrabold leading-10.5 text-white">
                Foody
              </span>
            </Link>
            <p className="text-base font-normal leading-7.5 tracking-[-0.32px] text-gray-25">
              Enjoy homemade flavors & chef&apos;s signature dishes, freshly
              prepared every day. Order online or visit our nearest branch.
            </p>
          </div>

          {/* Social Media */}
          <div className="flex flex-col gap-5">
            <span className="text-base font-normal leading-7.5 text-gray-25">
              Follow on Social Media
            </span>
            <div className="flex items-center gap-3">
              {["facebook", "instagram", "linkedin", "tiktok"].map((social) => (
                <button
                  key={social}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-800 text-white transition-colors hover:bg-gray-800"
                  aria-label={`Follow on ${social}`}
                >
                  <SocialIcon name={social} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Explore Links */}
        <div className="flex w-50 flex-col gap-5">
          <span className="text-base font-extrabold leading-7.5 text-gray-25">
            Explore
          </span>
          {exploreLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-base font-normal leading-7.5 tracking-[-0.32px] text-gray-25 transition-colors hover:text-white"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Help Links */}
        <div className="flex w-50 flex-col gap-5">
          <span className="text-base font-extrabold leading-7.5 text-gray-25">
            Help
          </span>
          {helpLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-base font-normal leading-7.5 tracking-[-0.32px] text-gray-25 transition-colors hover:text-white"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ name }: { name: string }) {
  switch (name) {
    case "facebook":
      return (
        <svg width="10" height="20" viewBox="0 0 10 20" fill="currentColor">
          <path d="M6.5 7H10L9.5 10H6.5V20H3V10H0V7H3V5.5C3 3.5 3.5 1 6.5 1H10V4H7.5C6.5 4 6.5 4.5 6.5 5V7Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 1.8C12.7 1.8 13 1.8 14.1 1.9C15.1 1.9 15.6 2.1 16 2.2C16.5 2.4 16.8 2.6 17.1 2.9C17.4 3.2 17.6 3.5 17.8 4C17.9 4.4 18.1 4.9 18.1 5.9C18.2 7 18.2 7.3 18.2 10C18.2 12.7 18.2 13 18.1 14.1C18.1 15.1 17.9 15.6 17.8 16C17.6 16.5 17.4 16.8 17.1 17.1C16.8 17.4 16.5 17.6 16 17.8C15.6 17.9 15.1 18.1 14.1 18.1C13 18.2 12.7 18.2 10 18.2C7.3 18.2 7 18.2 5.9 18.1C4.9 18.1 4.4 17.9 4 17.8C3.5 17.6 3.2 17.4 2.9 17.1C2.6 16.8 2.4 16.5 2.2 16C2.1 15.6 1.9 15.1 1.9 14.1C1.8 13 1.8 12.7 1.8 10C1.8 7.3 1.8 7 1.9 5.9C1.9 4.9 2.1 4.4 2.2 4C2.4 3.5 2.6 3.2 2.9 2.9C3.2 2.6 3.5 2.4 4 2.2C4.4 2.1 4.9 1.9 5.9 1.9C7 1.8 7.3 1.8 10 1.8ZM10 0C7.3 0 6.9 0 5.9 0.1C4.8 0.1 4.1 0.3 3.5 0.6C2.8 0.8 2.2 1.2 1.7 1.7C1.2 2.2 0.8 2.8 0.6 3.5C0.3 4.1 0.1 4.8 0.1 5.9C0 6.9 0 7.3 0 10C0 12.7 0 13.1 0.1 14.1C0.1 15.2 0.3 15.9 0.6 16.5C0.8 17.2 1.2 17.8 1.7 18.3C2.2 18.8 2.8 19.2 3.5 19.4C4.1 19.7 4.8 19.9 5.9 19.9C6.9 20 7.3 20 10 20C12.7 20 13.1 20 14.1 19.9C15.2 19.9 15.9 19.7 16.5 19.4C17.2 19.2 17.8 18.8 18.3 18.3C18.8 17.8 19.2 17.2 19.4 16.5C19.7 15.9 19.9 15.2 19.9 14.1C20 13.1 20 12.7 20 10C20 7.3 20 6.9 19.9 5.9C19.9 4.8 19.7 4.1 19.4 3.5C19.2 2.8 18.8 2.2 18.3 1.7C17.8 1.2 17.2 0.8 16.5 0.6C15.9 0.3 15.2 0.1 14.1 0.1C13.1 0 12.7 0 10 0Z" />
          <path d="M10 4.9C7.2 4.9 4.9 7.2 4.9 10C4.9 12.8 7.2 15.1 10 15.1C12.8 15.1 15.1 12.8 15.1 10C15.1 7.2 12.8 4.9 10 4.9ZM10 13.3C8.2 13.3 6.7 11.8 6.7 10C6.7 8.2 8.2 6.7 10 6.7C11.8 6.7 13.3 8.2 13.3 10C13.3 11.8 11.8 13.3 10 13.3Z" />
          <path d="M15.3 5.9C15.9 5.9 16.4 5.4 16.4 4.8C16.4 4.2 15.9 3.7 15.3 3.7C14.7 3.7 14.2 4.2 14.2 4.8C14.2 5.4 14.7 5.9 15.3 5.9Z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg width="17" height="16" viewBox="0 0 17 16" fill="currentColor">
          <path d="M3.8 16H0.3V5.3H3.8V16ZM2 3.8C0.9 3.8 0 2.9 0 1.9C0 0.9 0.9 0 2 0C3.1 0 4 0.9 4 1.9C4 2.9 3.1 3.8 2 3.8ZM16.5 16H13V10.7C13 9.4 13 7.7 11.1 7.7C9.2 7.7 8.9 9.1 8.9 10.6V16H5.4V5.3H8.7V6.8H8.8C9.3 5.9 10.4 5 12.1 5C15.7 5 16.4 7.3 16.4 10.3V16H16.5Z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg width="17" height="20" viewBox="0 0 17 20" fill="currentColor">
          <path d="M12.2 0C12.4 2.3 13.9 3.7 16.2 3.9V7.1C14.6 7.3 13.2 6.7 12.3 5.9V12.5C12.3 19.4 4.6 21.5 1.4 16.5C-0.6 13.3 0.5 7.6 6.2 7.4V10.8C5.7 10.9 5.2 11 4.7 11.2C3.4 11.6 2.6 12.5 2.8 14C3.2 16.7 7.8 17.5 7.4 12.3V0H12.2Z" />
        </svg>
      );
    default:
      return null;
  }
}
