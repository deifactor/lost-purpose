import { Art, Card } from "../cards";

export function context(art: Art): (id: string) => string {
  return (id) => `/dummy/${Art[art]}/id.fake`;
}
