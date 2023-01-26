import { useMutation, useQuery } from "@tanstack/react-query";
import { FormEvent, useRef } from "react";
import { Button } from "../../components/Button";
import { FullScreenCard } from "../../components/FullScreenCard";
import { Input } from "../../components/Input";
import { Link } from "../../components/Link";
import Select, { SelectInstance } from "react-select";
import { useNavigate, useResolvedPath } from "react-router-dom";
import { useLoggedInAuth } from "../../context/AuthContext";

export function NewChannel() {
  const navigate = useNavigate();
  const createChannel = useMutation({
    mutationFn: ({
      name,
      memberIds,
      imageUrl,
    }: {
      name: string;
      memberIds: string[];
      imageUrl?: string;
    }) => {
      if (streamChat == null) throw Error("Not Connected");
      return streamChat
        .channel("messaging", crypto.randomUUID(), {
          name,
          image: imageUrl,
          members: [user.id, ...memberIds],
        })
        .create();
    },
    onSuccess(){
        navigate("/")
    }
  });
  const { streamChat, user } = useLoggedInAuth();
  const nameRef = useRef<HTMLInputElement>(null);
  const imageUrlRef = useRef<HTMLInputElement>(null);
  const membersRef =
    useRef<SelectInstance<{ label: string; value: string }>>(null);
  const users = useQuery({
    queryFn: () =>
      streamChat!.queryUsers({ id: { $ne: user.id } }, { name: 1 }),
    enabled: streamChat != null,
    queryKey: ["stream", "users"],
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const name = nameRef.current?.value;
    const imageUrl = imageUrlRef.current?.value;
    const memberIds = membersRef.current?.getValue();

    if (
      name == null ||
      name === "" ||
      memberIds == null ||
      memberIds.length === 0
    )
      return;

    createChannel.mutate({
      name,
      imageUrl,
      memberIds: memberIds.map((option) => option.value),
    });
  }

  return (
    <FullScreenCard>
      <FullScreenCard.Body>
        <h1 className="text-3xl font-bold mb-8 text-center">
          New Conversation
        </h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-5 item-center justify-items-end"
        >
          <label htmlFor="name">Name</label>
          <Input id="name" required ref={nameRef} />
          <label htmlFor="imageUrl">Image Url</label>
          <Input id="imageUrl" ref={imageUrlRef} />
          <label htmlFor="members">Members</label>

          <Select
            ref={membersRef}
            id="members"
            isMulti
            required
            classNames={{ container: () => "w-full" }}
            isLoading={users.isLoading}
            options={users.data?.users.map((user) => {
              return { value: user.id, label: user.name || user.id };
            })}
          />

          <Button
            disabled={createChannel.isLoading}
            className="col-span-full"
            type="submit"
          >
            {createChannel.isLoading ? "Loading..." : "Create Conersation"}
          </Button>
        </form>
      </FullScreenCard.Body>
      <FullScreenCard.BelowCard>
        <Link to="/">Back</Link>
      </FullScreenCard.BelowCard>
    </FullScreenCard>
  );
}
