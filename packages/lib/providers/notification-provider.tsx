"use client"

import { ReactNode } from 'react';

type NotificationProviderProps = {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  // const { data: friendRequestReject } = useQuery({
  //   queryKey: REJECTED_QUERY_KEY
  // })
  //
  // console.log(friendRequestReject)
  //
  // useEffect(() => {
  //   if (friendRequestReject) {
  //     toast.info("ABOBA Запрос отозван")
  //   }
  // }, [friendRequestReject]);
  //
  return children;
}