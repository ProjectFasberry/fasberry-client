import type { ReactNode } from "react";
import { ToActionButtonX } from "../components/ui";
import { reatomComponent } from "@reatom/npm-react";
import { actionsState, getSelectedParentAtom, type ActionParent, type ActionType } from "./actions.model";

export const createPrivatedSectionModel = ({
  event, components
}: {
  event: ActionParent,
  components: {
    header: Record<"create" | "edit", ReactNode>,
    content: Record<ActionType, ReactNode>
  }
}) => {
  const HeaderViewElement = () => (
    <ToActionButtonX title="Создать" parent={event} type="create" />
  );

  const HeaderCreateElement = () => {
    return (
      <div className="flex items-center gap-1">
        <ToActionButtonX parent={event} type="create" />
        {components.header.create}
      </div>
    )
  }

  const HeaderEditElement = () => {
    return (
      <div className="flex items-center gap-1">
        <ToActionButtonX parent={event} type="edit" />
        {components.header.edit}
      </div>
    )
  }

  const VARIANTS: Record<ActionType, ReactNode> = {
    create: components.content.create,
    edit: components.content.edit,
    view: components.content.view
  }

  const Wrapper = reatomComponent(({ ctx }) => {
    if (!ctx.spy(getSelectedParentAtom(event as ActionParent))) return VARIANTS["view"]
    return VARIANTS[ctx.spy(actionsState.type)]
  }, `${event}.Wrapper`)

  return {
    Header: {
      Create: HeaderCreateElement,
      View: HeaderViewElement,
      Edit: HeaderEditElement
    },
    Wrapper
  }
}
