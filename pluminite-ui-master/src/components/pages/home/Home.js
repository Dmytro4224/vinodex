import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import { NearContext, MarketContractContext, NftContractContext } from '~/contexts';

import { useInfiniteQueryGemsWithBlackList } from '~/hooks';

import { DisplayText } from '~/components/common/typography';
import { Contribute, MintPlus } from '~/components/common/popups';
import { ArtItemPriced } from '~/components/common/art';
import { Button } from '~/components/common/buttons';

import { DiamondIcon } from '~/components/common/icons';

import { QUERY_KEYS, APP } from '~/constants';
import { Loading } from '~/components/common/utils';

const Container = styled('div')`
  padding: 15px;
  max-width: 1200px;
  margin: 100px auto 0;

  .description-container {
    margin-left: 30px;
  }

  .items-container {
    display: flex;
    flex-direction: column;
    align-items: center;

    .items {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: space-evenly;
    }

    .load-more {
      margin-top: 25px;
    }
  }

  .item {
    position: relative;
    transition: 250ms;
    margin: 15px 5px;

    :hover {
      transform: scale(1.01);
    }

    img {
      border-radius: 8px;
      max-width: 100%;

      @media (min-width: 1100px) {
        max-width: 320px;
      }
    }

    button {
      position: absolute;
      right: 20px;
      bottom: 20px;
    }
  }

  .desc {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 300;
    line-height: 36px;
  }

  .pop-up {
    position: sticky;
    bottom: 10px;
    right: 10px;
    width: fit-content;
    margin-left: auto;
  }

  .no-nfts {
    margin-top: 50px;
    text-align: center;

    .button {
      margin-top: 25px;
    }
  }

  @media (min-width: 767px) {
    .description-container {
      margin-left: 0;
      margin-bottom: 60px;
      text-align: center;
    }
  }
`;

export default function Home() {
  const { user } = useContext(NearContext);
  const { nftContract } = useContext(NftContractContext);
  const { getSalesPopulated, marketContract } = useContext(MarketContractContext);

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQueryGemsWithBlackList(
    QUERY_KEYS.SALES_POPULATED,
    ({ pageParam = 0 }) => getSalesPopulated(String(pageParam), String(APP.MAX_ITEMS_PER_PAGE_HOME)),
    {
      getNextPageParam(lastPage, pages) {
        if (lastPage.length === APP.MAX_ITEMS_PER_PAGE_HOME) {
          return pages.length * APP.MAX_ITEMS_PER_PAGE_HOME;
        }

        return undefined;
      },
      onError() {
        toast.error('Sorry 😢 There was an error getting gems you own.');
      },
      enabled: !!nftContract && !!marketContract,
    }
  );

  return (
    <Container>
      <div className="description-container">
        <DisplayText isBig>VINODEX</DisplayText>
        <div className="desc">Create, buy, and sell Vine NFT&apos;s with Cryptocurrency</div>
        <div>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/fl_j5geFdjM?controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        <div className="diamond">
          <DiamondIcon />
        </div>
      </div>
      <div className="items-container">
        <div className="items">
          {data?.length && data.map((sale) => <ArtItemPriced key={sale.token_id} nft={sale} isLink isFromIpfs />)}
          {!data?.length && !isFetching && (
            <div className="no-nfts">
              There is nothing here 😢 <br />
              <Button isPrimary isSmall>
                <Link to="/mint">Mint a Gem</Link>
              </Button>
            </div>
          )}
        </div>
        {hasNextPage && !isFetching && (
          <Button isPrimary onClick={() => fetchNextPage()} isDisabled={isFetching} className="load-more">
            Load more
          </Button>
        )}
        {isFetching && <Loading />}
      </div>
      <div className="pop-up">{user ? <MintPlus /> : <Contribute />}</div>
    </Container>
  );
}
