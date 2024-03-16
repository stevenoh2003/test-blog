import { useQuery } from "@tanstack/react-query"
import { blogQueryKey } from "src/constants/queryKey"
import { TPost } from "src/types"

const usePostsQuery = () => {
  const { data } = useQuery({
    queryKey: blogQueryKey.posts(),
    initialData: [] as TPost[],
    enabled: false,
  })

  if (!data) throw new Error("Posts data is not found")

  return data
}

export default usePostsQuery
