export function serverUrlSearchParamsAdapter(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  const urlSearchParams = new URLSearchParams();

  for (const [param, value] of Object.entries(searchParams)) {
    if (value) {
      urlSearchParams.set(param, `${value}`);
    }
  }

  return urlSearchParams;
}
