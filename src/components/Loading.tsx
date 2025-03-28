import styled from 'styled-components';
import CircularProgress from '@mui/material/CircularProgress';

const Loading = () => {
  return (
    <LoadingWrapper>
      <CircularProgress sx={{ color: '#5062F0' }} />
    </LoadingWrapper>
  );
};

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30vh;
  font-size: 24px;
`;

export default Loading;