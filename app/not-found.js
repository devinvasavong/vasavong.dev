import LinkText from "./components/Link";

export default function NotFound() {
  return (
    <div className="w-screen h-screen text-sm">
      <div className="max-w-4xl mx-auto p-6">
        <header className="md:mt-12">
          <h3>Well.. this is awkward</h3>
          <LinkText text="Go back home" href="/" />
        </header>
      </div>
    </div>
  );
}
