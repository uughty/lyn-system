"use client";

import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } 
from "@react-google-maps/api";

import { useEffect, useState } from "react";

interface Props {
  origin: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;
  setTrackStep: (step: number) => void;
  setEta: (eta: number) => void;
}

export default function TrackingMap({
  origin,
  destination,
  setTrackStep,
  setEta,
}: Props) {

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  const [riderPos, setRiderPos] =
    useState<google.maps.LatLngLiteral>(origin);

  // ✅ Get REAL route
  useEffect(() => {

    if (!isLoaded) return;

    const service =
      new google.maps.DirectionsService();

    service.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {

        if (status === "OK" && result) {

          setDirections(result);

          const route = result.routes[0].legs[0];

          // ETA in minutes
          setEta(Math.ceil(route.duration!.value / 60));

          simulateMovement(
            result.routes[0].overview_path
          );
        }
      }
    );
  }, [isLoaded]);

  // ⭐ Uber-style movement
  const simulateMovement = (
    path: google.maps.LatLng[]
  ) => {

    let index = 0;

    const interval = setInterval(() => {

      if (index >= path.length) {
        clearInterval(interval);
        setTrackStep(3);
        return;
      }

      setRiderPos({
        lat: path[index].lat(),
        lng: path[index].lng(),
      });

      const progress = index / path.length;

      if (progress > 0.7) setTrackStep(2);
      else if (progress > 0.3) setTrackStep(1);
      else setTrackStep(0);

      index++;

    }, 800); // smooth movement
  };

  if (!isLoaded)
    return <div className="p-10">Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={{
        width: "100%",
        height: "600px",
      }}
      center={destination}
      zoom={14}
    >
      {directions && (
        <DirectionsRenderer directions={directions} />
      )}

      <Marker position={destination} />

      <Marker
        position={riderPos}
        icon={{
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 5,
        }}
      />
    </GoogleMap>
  );
}
