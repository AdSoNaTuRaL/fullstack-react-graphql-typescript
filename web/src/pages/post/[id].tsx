import React from 'react';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { useRouter } from 'next/router';
import { usePostQuery } from '../../generated/graphql';
import { Layout } from '../../components/Layout';
import { Box, Heading } from '@chakra-ui/core';

const Post = ({ }) => {
  const router = useRouter();
  const intId = 
    typeof router.query.id === 'string' ? parseInt(router.query.id) : -1;
  const [{ data, error, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });

  if (fetching) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  if (error) {
    return <Box>{error.message}</Box>
  }

  if (!data?.post) {
    return (
      <Layout>
        <Heading mt={80} textAlign="center">Could not find post 😥</Heading>
      </Layout>
    );
  }

  return (
    <Layout>
      <Heading mb={4}>{data.post.title}</Heading>
      {data.post.text}
    </Layout>
  );
}

export default withUrqlClient(createUrqlClient)(Post);