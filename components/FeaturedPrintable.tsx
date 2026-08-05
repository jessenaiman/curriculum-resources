import Link from "next/link";

// The homepage's closing feature banner — a single real preschool topic
// with its activity-page image, matching the two-column "featured printable"
// banner that closes Figma's home page.
export function FeaturedPrintable() {
  return (
    <section className="featured-printable stitch">
      <div className="featured-printable-copy">
        <span className="eyebrow featured-printable-eyebrow">Preschool · Routines</span>
        <h2>A Barn Band Day</h2>
        <p className="featured-printable-tagline">Instruments, sound and simple choice-making</p>
        <p className="featured-printable-body">
          Children choose an instrument, keep a beat, and share with a peer — a hands-on preschool
          routine with a full illustrated activity page, ready to open and use.
        </p>
        <Link className="primary-button" href="/preschool">Open Preschool Lessons →</Link>
      </div>
      <div className="featured-printable-image">
        <img src="/scenes/early-years-worksheet-example.png" alt="A Barn Band Day — preschool instrument activity page" />
      </div>
    </section>
  );
}
