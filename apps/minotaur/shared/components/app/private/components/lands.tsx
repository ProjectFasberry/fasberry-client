import { reatomComponent } from "@reatom/npm-react";
import { lands, landsState } from "../models/lands.model";
import { createPrivatedSectionModel } from "../models/shared.model";
import { ButtonXSubmit } from "./ui";
import { Input } from "@/shared/ui/input";
import { type AtomMut } from "@reatom/framework";

const CreateLandSubmit = reatomComponent(({ ctx }) => {
  return (
    <ButtonXSubmit
      onClick={() => lands.create(ctx)}
      disabled={ctx.spy(lands.create.statusesAtom).isPending}
    />
  )
}, "CreateLandSubmit")

const fields = [
  { label: "Название", atom: landsState.create.landName },
  { label: "Описание", atom: landsState.create.title },
  { label: "Чанков", atom: landsState.create.initialChunksSize }
]
const CreateLandFormField = reatomComponent<typeof fields[number]>(({ ctx, atom, label }) => {
  const currentAtom = atom as AtomMut<string | number>;
  const v = ctx.spy(currentAtom);

  return (
    <Input
      placeholder={label}
      value={v}
      onChange={(e) => {
        if (typeof v === 'string') {
          (atom as AtomMut<string>)(ctx, e.target.value);
        } else {
          (atom as AtomMut<number>)(ctx, Number(e.target.value));
        }
      }}
    />
  )
}, "CreateLandFormField")
const CreateLandForm = () => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {fields.map((field, idx) => <CreateLandFormField key={idx} {...field} />)}
    </div>
  )
}

export const landsSection = createPrivatedSectionModel({
  event: "lands",
  components: {
    header: {
      create: <CreateLandSubmit />,
      edit: null
    },
    content: {
      create: <CreateLandForm />,
      edit: null,
      view: null
    }
  }
})
