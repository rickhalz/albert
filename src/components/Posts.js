import datas from "../data.json";
import PostContent from "./PostContent";
import { Routes, Route, Link } from "react-router-dom";

function List({ datas }) {
  return (
    <div>
      {Object.entries(datas).map(([year, datas]) =>
        datas.map((data) => (
          <>
            <h3>{year}</h3>
            <Link to={`/posts/${data.filename}`}>{data.title}</Link>
            <span>{data.month}</span>
          </>
        )),
      )}
    </div>
  );
}

export default function Posts() {
  return (
    <div className="postsArchive">
      <Routes>
        <Route path="/" element={<List datas={datas} />} />
        <Route path=":filename" element={<PostContent />} />
      </Routes>
    </div>
  );
}
