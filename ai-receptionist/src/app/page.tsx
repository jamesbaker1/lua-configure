import { redirect } from 'next/navigation';
import Image from "next/image";

export default function HomePage() {
  redirect('/configure');
  // return null; // Or a loading spinner, but redirect should handle it
}
