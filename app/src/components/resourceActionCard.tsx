import { useState } from "react";
import { Pressable, Text, View } from "react-native";

export type Activity = {
  label: string;
  onAction: (times: number) => void;
};

export type ResourceActionCardProps = {
  activities: Activity[];
};

export const ResourceActionCard = ({ activities }: ResourceActionCardProps) => {
  const [count, setCount] = useState(1);
  const [selected, setSelected] = useState(0);

  const selectedActivity = activities[selected];

  return (
    <>
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          borderWidth: 1,
          width: "100%",
          padding: 12,
          gap: 20,
        }}
      >
        <Text
          style={{ fontSize: 18, fontWeight: 500, alignSelf: "flex-start" }}
        >
          Actions
        </Text>

        <View
          style={{
            width: "100%",
            flexDirection: "row",
            gap: 12,
          }}
        >
          {activities.map((activity, index) => (
            <Pressable
              style={{ borderWidth: 1, padding: 4 }}
              key={activity.label}
              onPress={() => setSelected(index)}
            >
              <Text
                style={{
                  fontWeight: index === selected ? "bold" : "normal",
                }}
              >
                {activity.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <View
            style={{
              width: "auto",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            <Text style={{ paddingRight: 8 }}>select amount</Text>

            <Pressable
              style={{
                borderWidth: 1,
                width: 24,
                height: 24,
                alignItems: "center",
              }}
              onPress={() => setCount((prev) => Math.max(1, prev - 1))}
            >
              <Text style={{ fontSize: 18 }}>-</Text>
            </Pressable>

            <Text
              style={{
                borderWidth: 1,
                width: 24,
                height: 24,
                fontSize: 18,
                textAlign: "center",
              }}
            >
              {count}
            </Text>

            <Pressable
              style={{ borderWidth: 1, width: 24, alignItems: "center" }}
              onPress={() => setCount((prev) => prev + 1)}
            >
              <Text style={{ fontSize: 18 }}>+</Text>
            </Pressable>
          </View>
          <Pressable
            style={{ borderWidth: 1 }}
            onPress={() => selectedActivity.onAction(count)}
          >
            <Text
              style={{
                height: 24,
                padding: 4,
              }}
            >
              gather
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};
