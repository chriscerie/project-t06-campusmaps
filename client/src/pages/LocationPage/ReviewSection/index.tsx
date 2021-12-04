import { useState, useEffect } from 'react';
import axios from 'axios';
import type { ReviewType } from '../../../types/ReviewType';
import Review from './Review';
import type { UserType } from '../../../types/UserType';
import './index.scss';

function setComments(
  id: string,
  setBackendComments: (reviews: ReviewType[]) => void
) {
  axios
    .get<Array<ReviewType>>(`/api/v1/reviews/${id}`, {
      params: { filter_by: 'location' },
    })
    .then(async (res) => {
      setBackendComments(
        await Promise.all(
          res.data.map((comment) => {
            return axios
              .get<UserType>(`/api/v1/users/${comment.author_id}`)
              .then((res) => {
                comment.author = res.data;
                return comment;
              });
          })
        )
      );
    });
}

const ReviewSection = ({ id }: { id: string }) => {
  const [backendComments, setBackendComments] = useState<Array<ReviewType>>([]);

  useEffect(() => {
    setComments(id, setBackendComments);
  }, [id, setBackendComments]);

  return (
    <ul className="review-section-container">
      {backendComments.map((rootComment: ReviewType) => (
        <Review
          key={rootComment._id}
          comm={rootComment}
          setComments={() => {
            setComments(id, setBackendComments);
          }}
        />
      ))}
    </ul>
  );
};

export default ReviewSection;
