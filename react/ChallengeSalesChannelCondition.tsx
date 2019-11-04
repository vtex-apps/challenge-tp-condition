import React, { FC, useEffect, Fragment } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import { useQuery } from 'react-apollo'
import checkProfileAllowedQuery from './graphql/checkProfileAllowed.graphql'

type ContentVisibility = 'visible' | 'hidden'

const useRedirectForbidden = (
  redirectPath: string,
  isAuthenticated: boolean | null
) => {
  const { navigate } = useRuntime()

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate({
        to: redirectPath,
      })
    }
  }, [isAuthenticated, navigate, redirectPath])
}

interface Props {
  redirectPath: string
  defaultContentVisibility: ContentVisibility
}

const ChallengeSalesChannelCondition: FC<Props> = ({
  redirectPath = '/',
  defaultContentVisibility = 'visible',
  children,
}) => {
  // eslint-disable-next-line no-console
  console.log('ESTOU VIVO!!!!!')
  const { loading, data } = useQuery(checkProfileAllowedQuery, {
    ssr: false,
  })
  const isAuthenticated = !loading && data ? data.allowed : null

  useRedirectForbidden(redirectPath, isAuthenticated)

  if (defaultContentVisibility === 'hidden' || !isAuthenticated) {
    return null
  }

  return <Fragment>{children}</Fragment>
}

export default React.memo(ChallengeSalesChannelCondition)
