import { UsersViewer } from "../../models/users.model"
import { SectionWrapper } from "../ui"
import { Users, UsersItemMenu } from "./users.list"

export const UsersBody = () => {
  return (
    <SectionWrapper className="flex flex-col">
      <Users />
      <UsersViewer />
      <UsersItemMenu />
    </SectionWrapper>
  )
}
