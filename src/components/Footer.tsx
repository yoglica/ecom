export default function Footer() {
  return (
    <footer>
      <p>
        &copy; {new Date().getFullYear()} MyShop. All rights reserved.
      </p>
      <p>
        <a href="/about">About</a> | <a href="/contact">Contact</a> |{" "}
        <a href="/privacy">Privacy Policy</a>
      </p>
    </footer>
  );
}
