import "../styles/SunMoon.css";

export default function SunAndMoon({ handleTheme }) {
  return (
    <span id="darkmode" role="button" onClick={handleTheme}>
      <div class="darkmode_icon">
        <span class="ray"></span>
        <span class="ray"></span>
        <span class="ray"></span>
        <span class="ray"></span>
        <span class="ray"></span>
        <span class="ray"></span>
        <span class="ray"></span>
        <span class="ray"></span>
      </div>
    </span>
  );
}
