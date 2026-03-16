"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface DeleteProjectButtonProps {
  projectId: string;
  projectName: string;
}

export default function DeleteProjectButton({ projectId, projectName }: DeleteProjectButtonProps) {
  const router = useRouter();

  const onDelete = async () => {
    const check = prompt(`Чтобы удалить проект, введите его название:\n${projectName}`);
    if (check !== projectName) return;
    const finalCheck = confirm("Удалить проект без возможности восстановления?");
    if (!finalCheck) return;

    const supabase = createClient();
    const { error } = await supabase.from("projects").delete().eq("id", projectId);
    if (error) {
      alert("Не удалось удалить проект.");
      return;
    }
    router.push("/projects");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={onDelete}
      className="min-h-[40px] px-4 rounded-[20px] border border-[var(--color-error)] text-[var(--color-error)] inline-flex items-center md-typescale-label-large"
    >
      Удалить
    </button>
  );
}
