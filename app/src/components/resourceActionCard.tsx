import { styles } from "@/styles/main";
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
        <Text style={styles.text}>Gather Resources</Text>

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
              <Text style={styles.text}>{activity.label}</Text>
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
            <Text style={[styles.text, { paddingRight: 8 }]}>
              select amount
            </Text>

            <Pressable
              style={{
                borderWidth: 1,
                width: 24,
                height: 24,
                alignItems: "center",
              }}
              onPress={() => setCount((prev) => Math.max(1, prev - 1))}
            >
              <Text style={styles.text}>-</Text>
            </Pressable>

            <Text
              style={[
                styles.text,
                {
                  borderWidth: 1,
                  width: 24,
                  height: 24,
                  textAlign: "center",
                },
              ]}
            >
              {count}
            </Text>

            <Pressable
              style={{
                borderWidth: 1,
                width: 24,
                height: 24,
                alignItems: "center",
              }}
              onPress={() => setCount((prev) => prev + 1)}
            >
              <Text style={styles.text}>+</Text>
            </Pressable>
          </View>
          <Pressable
            style={{ borderWidth: 1, padding: 4 }}
            onPress={() => selectedActivity.onAction(count)}
          >
            <Text
              style={[
                styles.text,
                {
                  height: 24,
                },
              ]}
            >
              gather
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};
