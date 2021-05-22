import Link from "next/link";

export default function GamesDemoIndexPage() {
  return (
    <>
      <li>
        <Link href="./games/games-tanks-demo">Tanks demo</Link>
      </li>
      <li>
        <Link href="./games/games-dragon-crushers">Dragon Crushers demo</Link>
      </li>
      <li>
        <Link href="./games/games-endless-runner">Endless Runner demo</Link>
      </li>
    </>
  );
}
