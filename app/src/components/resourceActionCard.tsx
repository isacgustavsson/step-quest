import { styles } from "@/styles/main";
import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const sprites = {
  forest: require("@assets/img/forest.jpg"),
};

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
    <View style={[styles.card, { alignItems: "center" }]}>
      <Text style={styles.text}>Gather Resources</Text>
      <View style={{ width: "100%", height: 200, overflow: "hidden" }}>
        <Image
          source={sprites.forest}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        ></Image>
      </View>

      <View style={[styles.row, { width: "100%", gap: 12 }]}>
        {activities.map((activity, index) => (
          <Pressable
            key={activity.label}
            style={[styles.button, index === selected && styles.buttonSelected]}
            onPress={() => setSelected(index)}
          >
            <Text style={styles.text}>{activity.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.rowBetween}>
        <View style={styles.row}>
          <Text style={[styles.text, { marginRight: 8 }]}>amount</Text>

          <Pressable
            style={styles.square}
            onPress={() => setCount((prev) => Math.max(1, prev - 1))}
          >
            <Text style={styles.text}>-</Text>
          </Pressable>

          <View style={styles.square}>
            <Text style={styles.text}>{count}</Text>
          </View>

          <Pressable
            style={styles.square}
            onPress={() => setCount((prev) => prev + 1)}
          >
            <Text style={styles.text}>+</Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.button}
          onPress={() => selectedActivity?.onAction(count)}
        >
          <Text style={styles.text}>gather</Text>
        </Pressable>
      </View>
    </View>
  );
};
