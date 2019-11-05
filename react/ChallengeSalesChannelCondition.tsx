import React, { FC, useEffect, Fragment } from 'react'
import { useRuntime, SessionUnauthorized } from 'vtex.render-runtime'
import { useQuery } from 'react-apollo'
import checkProfileAllowedQuery from './graphql/checkProfileAllowed.graphql'
import withSession, { InjectedWithSessionProps } from './components/withSession'

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

interface Props extends InjectedWithSessionProps {
  redirectPath: string
  defaultContentVisibility: ContentVisibility
}

const ChallengeSalesChannelCondition: FC<Props> = ({
  session,
  redirectPath = '/login',
  defaultContentVisibility = 'visible',
  children,
}) => {
  const unauthorized =
    session && (session as SessionUnauthorized).type === 'Unauthorized'
  const { loading, data, error } = useQuery(checkProfileAllowedQuery, {
    ssr: false,
    skip: unauthorized,
  })

  const isAuthenticated =
    unauthorized === true
      ? false
      : !loading && data && !error
      ? !!data.checkProfileAllowed.allowed
      : null

  useRedirectForbidden(redirectPath, isAuthenticated)

  if (defaultContentVisibility === 'hidden' || isAuthenticated === false) {
    return null
  }

  return <Fragment>{children}</Fragment>
}

export default React.memo(withSession(ChallengeSalesChannelCondition))
