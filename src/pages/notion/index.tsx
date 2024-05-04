import dynamic from 'next/dynamic';
import { CONFIG } from "../../../site.config";
import { NextPageWithLayout } from "../../types";
import { getPosts } from "../../apis";
import MetaConfig from "src/components/MetaConfig";
import { queryClient } from "src/libs/react-query";
import { queryKey } from "src/constants/queryKey";
import { GetStaticProps } from "next";
import { dehydrate } from "@tanstack/react-query";
import { filterPosts } from "src/libs/utils/notion/getBlogPost";
import styled from "@emotion/styled";
import React from "react";

const BlogFeed = dynamic(() => import("src/routes/BlogFeed"), {
  loading: () => <div>Loading...</div>,
  // Optionally add ssr: false if you do not need SSR for this component
});

export const getStaticProps: GetStaticProps = async () => {
  const posts = filterPosts(await getPosts());
  await queryClient.prefetchQuery(queryKey.posts(), () => posts);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: CONFIG.revalidateTime,
  }
}

const FeedPage: NextPageWithLayout = () => {
  const meta = {
    title: CONFIG.blog.title,
    description: CONFIG.blog.description,
    type: "website",
    url: CONFIG.link,
  }

  return (
    <div style={{ backgroundColor: "#f2f3ef" }}>
      <StyledMain>
        <MetaConfig {...meta} />
        <BlogFeed />
      </StyledMain>
    </div>
  )
}

export default FeedPage;

const StyledMain = styled.main`
  margin: 0 auto;
  width: 100%;
  max-width: 1120px;
  padding: 2rem 0.5rem;
`