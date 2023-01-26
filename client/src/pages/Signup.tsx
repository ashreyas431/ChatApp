import { FormEvent, useRef } from "react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useAuth } from "../context/AuthContext";
export function Signup() {
  const { signup } = useAuth();
  const userNameRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const imageUrlRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (signup.isLoading) return;

    const userName = userNameRef.current?.value;
    const name = nameRef.current?.value;
    const image = imageUrlRef.current?.value;

    if (userName == null || userName === "" || name == null || name === "")
      return;

    signup.mutate({ id: userName, name, image: image });
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-8 text-center">Sign Up</h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-5 item-center justify-items-end"
      >
        <label htmlFor="userName">Username</label>
        <Input id="userName" pattern="\S*" required ref={userNameRef} />
        <label htmlFor="name">Name</label>
        <Input id="name" required ref={nameRef} />
        <label htmlFor="imageUrl">Image Url</label>
        <Input id="imageUrl" type="url" ref={imageUrlRef} />
        <Button disabled = {signup.isLoading} className="col-span-full" type="submit">
          {signup.isLoading?"Loading...":"Create Account"}
        </Button>
      </form>
    </>
  );
}
