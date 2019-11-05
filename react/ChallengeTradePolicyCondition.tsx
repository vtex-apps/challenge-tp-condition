import React, { FC, useEffect, Fragment, useState } from 'react'
import { useRuntime, SessionUnauthorized, Session } from 'vtex.render-runtime'
import { useQuery } from 'react-apollo'
import checkProfileAllowedQuery from './graphql/checkProfileAllowed.graphql'
import { getSession } from './modules/session'

type ContentVisibility = 'visible' | 'hidden'

const useRedirectIfForbidden = (
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

const useSessionAuthorization = () => {
  const [session, setSession] = useState<Session | SessionUnauthorized>()
  const sessionPromise = getSession()

  useEffect(() => {
    if (!sessionPromise) {
      return
    }

    sessionPromise.then(sessionResponse => {
      setSession(sessionResponse.response)
    })
  }, [sessionPromise])

  if (session === undefined) {
    return null
  }

  return session &&
    (session as SessionUnauthorized).type &&
    (session as SessionUnauthorized).type.toLowerCase() === 'unauthorized'
    ? false
    : true
}

interface Props {
  redirectPath: string
  defaultContentVisibility: ContentVisibility
}

const useProfileAllowed = (skip: boolean) => {
  const { loading, data, error } = useQuery(checkProfileAllowedQuery, {
    ssr: false,
    skip,
  })

  return !loading && data && !error ? !!data.checkProfileAllowed.allowed : null
}

const ChallengeTradePolicyCondition: FC<Props> = ({
  redirectPath = '/login',
  defaultContentVisibility = 'visible',
  children,
}) => {
  const isAuthorized = useSessionAuthorization()
  const profileAllowed = useProfileAllowed(!isAuthorized)

  const isAuthenticated = isAuthorized === false ? false : profileAllowed

  useRedirectIfForbidden(redirectPath, isAuthenticated)

  if (defaultContentVisibility === 'hidden' || isAuthenticated === false) {
    return null
  }

  return <Fragment>{children}</Fragment>
}

export default React.memo(ChallengeTradePolicyCondition)
