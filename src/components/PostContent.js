import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Markdown from "markdown-to-jsx";
import "../styles/PostContent.css";

const extractHeadings = (markdown) => {
  const headingLines = markdown
    .split("\n")
    .filter((line) => /^#{1,6}\s/.test(line));
  return headingLines.map((line) => {
    const level = line.match(/^#{1,6}/)[0].length;
    const text = line.replace(/^#{1,6}\s/, "").trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-");
    return { level, text, id };
  });
};

function TOC({ headings }) {
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target.id);

        if (visible.length > 0) {
          setCurrentId(visible[visible.length - 1]); // Take the last one intersecting (nearest to top)
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const renderHeadings = (headings, parentLevel = 1, parentId = null) => {
    return headings
      .filter(
        (h) =>
          h.level === parentLevel &&
          (parentLevel === 1 || isChildOf(h, parentId, headings)),
      )
      .map((h, index) => {
        const isActive = h.id === currentId;
        const hasChildren = headings.some(
          (child) =>
            child.level === h.level + 1 && isChildOf(child, h.id, headings),
        );
        const showChildren =
          hasChildren &&
          (isActive || isParentActive(h.id, currentId, headings));

        return (
          <div key={h.id} style={{ paddingLeft: `${(h.level - 1) * 16}px` }}>
            <a
              href={`#${h.id}`}
              style={{
                fontWeight: isActive ? "bold" : "normal",
                color: isActive ? "#38bdf8" : "#d1d5db",
              }}
            >
              {h.text}
            </a>
            {showChildren && renderHeadings(headings, h.level + 1, h.id)}
          </div>
        );
      });
  };

  return (
    <div className="toc-container">
      <h2 className="toc-title">Contents</h2>
      <div className="toc-list">{renderHeadings(headings)}</div>
    </div>
  );
}

// Find if child is under parent in structure by scanning upwards
function isChildOf(child, parentId, headings) {
  const index = headings.findIndex((h) => h.id === child.id);
  for (let i = index - 1; i >= 0; i--) {
    if (headings[i].level < child.level) {
      return headings[i].id === parentId;
    }
  }
  return false;
}

// Check if any ancestor of currentId is the parentId
function isParentActive(parentId, currentId, headings) {
  let current = headings.find((h) => h.id === currentId);
  while (current) {
    const prev = findParent(current, headings);
    if (prev?.id === parentId) return true;
    current = prev;
  }
  return false;
}

function findParent(child, headings) {
  const index = headings.findIndex((h) => h.id === child.id);
  for (let i = index - 1; i >= 0; i--) {
    if (headings[i].level < child.level) return headings[i];
  }
  return null;
}

export default function PostContent() {
  const { filename } = useParams();
  const [content, setContent] = useState("");

  useEffect(() => {
    if (filename) {
      import(`../posts/${filename}`).then((res) => {
        fetch(res.default)
          .then((res) => res.text())
          .then((res) => setContent(res))
          .catch((err) => console.log(err));
      });
    }
  }, [filename]);
  const headings = extractHeadings(content);

  return (
    <>
      <Markdown>{content}</Markdown>
      <TOC headings={headings} />
    </>
  );
}
