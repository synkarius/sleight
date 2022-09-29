import React, { ReactElement } from 'react';
import { useParams } from 'react-router-dom';

type ParamsFn = (
  params: Record<string, string | undefined>
) => ReactElement<unknown>;

/**
 * React Router v6's `useParams` hook tightly couples a component
 * to a URL. What if I want to use one of these components in a
 * screen without the corresponding info in the URL?
 * I guess the React Router v6 answer is that I shouldn't be doing
 * that, but IMO that doesn't seem well thought out. The design should
 * drive the technology, not the other way around.
 *
 * React Router v5 had the `render` parameter on the <Route> component.
 * This component is a workaround for the removal of that parameter.
 */
export const RouterV6WorkaroundComponent: React.FC<{
  paramsFn: ParamsFn;
}> = (props) => {
  const params: Record<string, string | undefined> = useParams();

  return <>{props.paramsFn(params)}</>;
};
