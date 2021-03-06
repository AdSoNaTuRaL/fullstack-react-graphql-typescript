import React from 'react';
import { Formik, Form } from 'formik';
import { Layout } from '../../../components/Layout';
import { Box, Button, Heading } from '@chakra-ui/core';
import { useGetIntId } from '../../../utils/useGetIntId';
import { InputField } from '../../../components/InputField';
import { useUpdatePostMutation } from '../../../generated/graphql';
import { useGetPostFromUrl } from '../../../utils/useGetPostFromUrl';
import { Router, useRouter } from 'next/router';
import { withApollo } from '../../../utils/withApollo';

const EditPost = ({ }) => {
  const router = useRouter();
  const intId = useGetIntId();
  const { data, loading } = useGetPostFromUrl();
  const [updatePost] = useUpdatePostMutation();

  if (loading) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  if (!data?.post) {
    return (
      <Layout>
        <Heading mt={80} textAlign="center">Could not find post 😥</Heading>
      </Layout>
    );
  }

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          await updatePost({ variables: { id: intId, ...values } });
          router.back();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="title"
              placeholder="Type your post's title"
              label="Title"
            />
            <Box mt={4}>
              <InputField
                textarea
                name="text"
                placeholder="Type your post's text"
                label="Body"
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              variantColor="teal"
            >
              Update Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}

export default withApollo({ ssr: false })(EditPost);