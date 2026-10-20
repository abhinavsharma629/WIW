import "./WeddingHashtag.css";

export default function WeddingHashtag() {
  return (
    <span
      className="wedding-hashtag"
      role="img"
      aria-label="#AbhiGotHisMishi (Khu crossed out, Mi written above)"
    >
      <span aria-hidden="true">
        #AbhiGotHis<span className="wedding-hashtag-edit">
          <del>Khu</del>
          <ins>Mi</ins>
        </span>shi
      </span>
    </span>
  );
}
