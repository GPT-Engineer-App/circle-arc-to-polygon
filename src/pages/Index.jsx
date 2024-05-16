import React, { useState } from "react";
import { Container, Text, VStack, Input, Button, Textarea } from "@chakra-ui/react";
import { FaRocket } from "react-icons/fa";

const toRadians = (angle) => (angle * Math.PI) / 180;

const generateArcPoints = (center, radius, startAngle, stopAngle, numPoints = 100) => {
  const points = [];
  const angleStep = (stopAngle - startAngle) / numPoints;

  for (let i = 0; i <= numPoints; i++) {
    const angle = toRadians(startAngle + i * angleStep);
    const x = center[0] + radius * Math.cos(angle);
    const y = center[1] + radius * Math.sin(angle);
    points.push([x, y]);
  }

  return points;
};

const generateGeoJSONPolygon = (center, innerRadius, outerRadius, startAngle, stopAngle) => {
  const outerArcPoints = generateArcPoints(center, outerRadius, startAngle, stopAngle);
  const innerArcPoints = generateArcPoints(center, innerRadius, stopAngle, startAngle).reverse();

  const coordinates = [...outerArcPoints, ...innerArcPoints, outerArcPoints[0]];

  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [coordinates],
    },
    properties: {},
  };
};

const Index = () => {
  const [center, setCenter] = useState([0, 0]);
  const [innerRadius, setInnerRadius] = useState(0);
  const [outerRadius, setOuterRadius] = useState(0);
  const [startAngle, setStartAngle] = useState(0);
  const [stopAngle, setStopAngle] = useState(0);
  const [geoJSON, setGeoJSON] = useState(null);

  const handleGenerate = () => {
    const polygon = generateGeoJSONPolygon(center, innerRadius, outerRadius, startAngle, stopAngle);
    setGeoJSON(JSON.stringify(polygon, null, 2));
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">Circle Arc to GeoJSON Polygon</Text>
        <Input placeholder="Center (e.g., 0,0)" value={center.join(",")} onChange={(e) => setCenter(e.target.value.split(",").map(Number))} />
        <Input placeholder="Inner Radius" type="number" value={innerRadius} onChange={(e) => setInnerRadius(Number(e.target.value))} />
        <Input placeholder="Outer Radius" type="number" value={outerRadius} onChange={(e) => setOuterRadius(Number(e.target.value))} />
        <Input placeholder="Start Angle" type="number" value={startAngle} onChange={(e) => setStartAngle(Number(e.target.value))} />
        <Input placeholder="Stop Angle" type="number" value={stopAngle} onChange={(e) => setStopAngle(Number(e.target.value))} />
        <Button leftIcon={<FaRocket />} colorScheme="teal" onClick={handleGenerate}>
          Generate GeoJSON
        </Button>
        {geoJSON && <Textarea value={geoJSON} readOnly height="200px" />}
      </VStack>
    </Container>
  );
};

export default Index;
