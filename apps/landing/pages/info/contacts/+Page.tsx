import { env } from "@/shared/env";
import { MainWrapperPage } from "@/shared/ui/main-wrapper";

const tgLink = `https://t.me/${env.PUBLIC_ENV__TG_NAME}`
const SUPPORT_EMAIL = env.VITE_SUPPORT_EMAIL;

export default function InfoContactsPage() {
  return (
    <MainWrapperPage variant="with_section">
      <div id="contacts-n-feedback" class="flex flex-col min-h-screen responsive mx-auto py-36 gap-y-6">
        <p class="text-3xl">Контакты</p>
        <div class="flex flex-col gap-6">
          <div class="flex flex-col gap-4 border-2 border-[#454545] duration-300 rounded-lg p-4">
            <p class="text-xl">Социальные сети и мессенджеры</p>
            <div class="flex flex-col text- md lg:text-lg gap-y-4">
              <p>
                Канал в Telegram:&nbsp;&nbsp;
                <a href={tgLink} target="_blank" class="text-green">
                  {tgLink}
                </a>
              </p>
            </div>
          </div>
          <div class="flex flex-col gap-4 border-2 text-md lg:text-lg border-[#454545] duration-300 rounded-lg p-4">
            <p class="text-xl">Электронная почта</p>
            <div class="flex flex-col gap-y-4">
              <a href={`mailto:${SUPPORT_EMAIL}`} target="_blank">
                <p>{SUPPORT_EMAIL}</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </MainWrapperPage>
  )
}
