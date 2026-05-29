import { getCommunityFolder } from "@/shared/const/folders";
import { atom } from "@reatom/framework";

export const GALLERY_LIST = [
  getCommunityFolder("moon"),
  getCommunityFolder("sunset"),
  getCommunityFolder("market"),
  getCommunityFolder("duck"),
  getCommunityFolder("dragon_dead"),
  getCommunityFolder("hills"),
  getCommunityFolder("market_seller"),
  getCommunityFolder("offenburg"),
  getCommunityFolder("night"),
  getCommunityFolder("water_sand"),
  getCommunityFolder("early_sunset"),
];

export const selectedKeyAtom = atom(0, "selectedKey")
