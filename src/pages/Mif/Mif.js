import "./Mif.css";
import SEO from "components/Common/SEO";
import { getPageTitle } from "lib/legacy";

export default function Mif() {
  return (
    <SEO title={getPageTitle("MIF Page")}>
      <div className="mif-page">
        <iframe
          className="mif-iframe"
          src="https://main.d3vd0cr90ir0ol.amplifyapp.com/"
          height="200"
          width="300"
          title="Iframe Example"
        ></iframe>
      </div>
    </SEO>
  );
}
