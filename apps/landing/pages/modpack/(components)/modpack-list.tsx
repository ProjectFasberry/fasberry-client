import { Typography } from '@/shared/ui/typography';
import { Skeleton } from '@/shared/ui/skeleton';
import { dayjs } from '@/shared/lib/create-dayjs';
import { Dialog } from '@ark-ui/solid/dialog';
import { Button } from '@/shared/ui/button';
import { useAtom, useCtx } from '@reatom/npm-solid-js';
import { ErrorBoundary, For, Index, Show } from 'solid-js';
import { modpacks, modpacksState, type Modpack, type Modpacks } from '../(models)/modpack.model';
import { Portal } from 'solid-js/web';
import { dialogBackdropVariant, dialogContentVariant, dialogPositionerVariant } from '@/shared/ui/dialog';

const SelectedModpack = () => {
  const [modpackAtom] = useAtom(modpacksState.item)

  return (
    <Show when={modpackAtom()}>
      {(data) => {
        const { mods, imageUrl, downloadLink, shaders, name } = data()

        const created_at = dayjs(data().created_at.toString()).format('DD MMM YYYY')

        return (
          <div class="flex flex-col gap-6 w-full">
            <div>
              <img
                src={imageUrl}
                alt={name}
                class="object-cover bg-neutral-800 h-40 w-full"
              />
            </div>
            <div class="flex flex-col gap-4 w-full">
              <div class="flex flex-col">
                <Typography class="text-lg">Моды</Typography>
                <Show
                  when={mods}
                  fallback={<Typography color="gray" class="text-base">пусто</Typography>}
                >
                  {(data) =>
                    <div class="flex items-center gap-2 flex-wrap">
                      <div class="flex bg-neutral-600/80 px-2 py-1 rounded-sm">
                        <Typography class="text-base">{data()}</Typography>
                      </div>
                    </div>
                  }
                </Show>
              </div>
              <div class="flex flex-col w-full">
                <Typography class='text-lg'>Шейдеры</Typography>
                <Show
                  when={shaders}
                  fallback={<Typography color="gray" class="text-base">пусто</Typography>}
                >
                  {(data) =>
                    <div class="flex bg-neutral-600/80 px-4 py-1 rounded-sm">
                      <Typography class="text-lg">
                        {data()}
                      </Typography>
                    </div>
                  }
                </Show>
              </div>
              <div class="self-end">
                <Typography color="gray" class='text-sm'>
                  Создан {created_at}
                </Typography>
              </div>
            </div>
            <div class="flex items-center justify-center w-full">
              <Button class='w-full text-sm'>
                <a href={downloadLink} target="_blank" rel="noopener noreferrer" class='w-full'>
                  Скачать
                </a>
              </Button>
            </div>
          </div>
        )
      }}
    </Show>
  )
}

const ModpackItemDialog = () => {
  const [isOpenAtom, setIsOpenAtom] = useAtom(modpacksState.isOpen);

  return (
    <Dialog.Root
      open={isOpenAtom()}
      onOpenChange={details => setIsOpenAtom(details.open)}
    >
      <Portal>
        <Dialog.Backdrop class={dialogBackdropVariant()} />
        <Dialog.Positioner class={dialogPositionerVariant()}>
          <Dialog.Content class={dialogContentVariant({ class: "sm:w-1/4" })}>
            <SelectedModpack />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

const ModpackItem = (props: Modpack) => {
  const ctx = useCtx();

  const m = () => {
    const { id, name, version, shaders, mods, client, imageUrl, downloadLink } = props;
    return { id, name, version, shaders, mods, client, imageUrl, downloadLink };
  };

  return (
    <div class="flex flex-col transparent-achievement-panel gap-4 justify-between h-full p-4 relative">
      <div class="flex flex-col gap-2 justify-between grow">
        <Typography class="text-lg lg:text-xl sm:text-2xl text-project-color">
          {m().name}
        </Typography>
        <div class="flex items-center gap-2 text-base sm:text-lg">
          <Typography>
            Клиент: {m().client}
          </Typography>
          <Typography color="gray">
            ({m().version})
          </Typography>
        </div>
        <div class="flex items-center justify-center w-full gap-1">
          <a
            href={m().downloadLink}
            target="_blank"
            rel="noreferrer"
            class='w-full md:w-1/2'
          >
            <Button class="py-0.5 text-sm sm:text-base w-full">
              <Typography>
                Скачать
              </Typography>
            </Button>
          </a>
          <Button
            onClick={() => modpacks.open(ctx, m().id)}
            class="w-full py-0.5 md:w-1/2  text-sm sm:text-base "
          >
            <Typography>
              Подробнее
            </Typography>
          </Button>
        </div>
      </div>
      <div
        class="h-[140px] sm:h-[200px] group bg-neutral-800 relative overflow-hidden"
      >
        <img src={m().imageUrl} alt={m().name} class="w-full h-full object-cover" />
      </div>
    </div>
  );
}

const ModpackError = () => {
  return (
    <div class="flex flex-col gap-2 w-full items-center justify-cenetr">
      <Typography class="text-red text-2xl">
        Ошибка загрузки модпаков
      </Typography>
      <span class="truncate text-sm text-neutral-400">
        Повторите попытку позже
      </span>
    </div>
  )
}

const ModpackListEmpty = () => {
  return <Typography class="text-neutral-400 text-2xl">Модпаков еще нет</Typography>
};

const ModpackListSkeleton = () => {
  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full xl:grid-cols-4 gap-4 grid-rows-2">
      <Index each={Array.from({ length: 6 })}>
        {() => <Skeleton class="w-full h-80" />}
      </Index>
    </div>
  );
};

export const ModpackList = (props: { data?: Modpacks }) => {
  return (
    <ErrorBoundary fallback={<ModpackError />}>
      <Show when={props.data} fallback={<ModpackListEmpty />}>
        {(data) => (
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full xl:grid-cols-4 gap-4 grid-rows-2">
            <ModpackItemDialog />
            <For each={data()}>
              {(modpack) => <ModpackItem {...modpack} />}
            </For>
          </div>
        )}
      </Show>
    </ErrorBoundary>
  );
}
