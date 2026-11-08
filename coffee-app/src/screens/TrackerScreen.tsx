// THE SCREEN: what the user sees and taps.
//
// Same three ideas as step 2 (state -> actions -> render), but React does
// the "redraw the screen" part for us: whenever state changes, React
// re-runs this function and updates only what changed.
//
// We use React Native building blocks instead of HTML:
//   <div>    -> <View>
//   <p>      -> <Text>
//   <input>  -> <TextInput>
//   <button> -> <Pressable>
// These work in a web browser now AND on iPhone/Android later.

import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import {
  addPurchase,
  budgetRemaining,
  formatMoney,
  removePurchase,
  totalSpent,
  validatePurchase,
  type Purchase,
} from "../core/purchases";
import { getColors } from "../theme";

export default function TrackerScreen() {
  // STATE. useState gives a value and a function to change it.
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [budgetText, setBudgetText] = useState("30");
  const [itemText, setItemText] = useState("");
  const [priceText, setPriceText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const colors = getColors(useColorScheme());
  const budget = Number(budgetText) || 0;
  const remaining = budgetRemaining(purchases, budget);

  // ACTIONS
  function handleAdd() {
    const problem = validatePurchase(itemText, priceText);
    if (problem) {
      setError(problem);
      return;
    }
    setPurchases(addPurchase(purchases, itemText, Number(priceText)));
    setItemText("");
    setPriceText("");
    setError(null);
  }

  function handleDelete(id: string) {
    setPurchases(removePurchase(purchases, id));
  }

  // RENDER: describe what the screen should look like for the current state
  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={styles.page}>
      <View style={styles.app}>
        <Text style={[styles.title, { color: colors.text }]}>☕ Coffee Tracker</Text>

        <View style={styles.summary}>
          <SummaryCard label="Spent" value={formatMoney(totalSpent(purchases))} testID="total" colors={colors} />
          <SummaryCard
            label="Budget left"
            value={formatMoney(remaining)}
            testID="remaining"
            colors={colors}
            danger={remaining < 0}
          />
          <SummaryCard label="Purchases" value={String(purchases.length)} testID="count" colors={colors} />
        </View>

        <View style={styles.form}>
          <TextInput
            testID="item-input"
            style={[styles.input, styles.itemInput, inputColors(colors)]}
            placeholder="What did you buy?"
            placeholderTextColor={colors.muted}
            value={itemText}
            onChangeText={setItemText}
            onSubmitEditing={handleAdd}
          />
          <TextInput
            testID="price-input"
            style={[styles.input, styles.priceInput, inputColors(colors)]}
            placeholder="Price"
            placeholderTextColor={colors.muted}
            keyboardType="decimal-pad"
            value={priceText}
            onChangeText={setPriceText}
            onSubmitEditing={handleAdd}
          />
          <Pressable
            testID="add-button"
            accessibilityRole="button"
            style={[styles.button, { backgroundColor: colors.accent }]}
            onPress={handleAdd}
          >
            <Text style={styles.buttonText}>Add</Text>
          </Pressable>
        </View>

        <Text testID="error" style={[styles.error, { color: colors.danger }]}>
          {error ?? ""}
        </Text>

        <View style={styles.budgetRow}>
          <Text style={{ color: colors.muted }}>Weekly budget: $</Text>
          <TextInput
            testID="budget-input"
            style={[styles.input, styles.budgetInput, inputColors(colors)]}
            keyboardType="number-pad"
            value={budgetText}
            onChangeText={setBudgetText}
          />
        </View>

        {purchases.length === 0 ? (
          <Text style={[styles.empty, { color: colors.muted }]}>No purchases yet. Add one above.</Text>
        ) : (
          purchases.map((p) => (
            <View
              key={p.id}
              testID="purchase-row"
              style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <Text style={[styles.rowItem, { color: colors.text }]}>{p.item}</Text>
              <Text style={[styles.rowPrice, { color: colors.text }]}>{formatMoney(p.price)}</Text>
              <Pressable
                testID="delete-button"
                accessibilityRole="button"
                accessibilityLabel={`Delete ${p.item}`}
                onPress={() => handleDelete(p.id)}
                style={styles.delete}
              >
                <Text style={{ color: colors.muted, fontSize: 16 }}>✕</Text>
              </Pressable>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

// A small reusable piece of screen ("component"). Like writing a function
// in R so you don't repeat yourself.
type Colors = ReturnType<typeof getColors>;

function SummaryCard(props: { label: string; value: string; testID: string; colors: Colors; danger?: boolean }) {
  const { colors } = props;
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.cardLabel, { color: colors.muted }]}>{props.label}</Text>
      <Text testID={props.testID} style={[styles.cardValue, { color: props.danger ? colors.danger : colors.text }]}>
        {props.value}
      </Text>
    </View>
  );
}

function inputColors(colors: Colors) {
  return { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text };
}

// STYLES: like CSS, but written as JavaScript so it also works on phones.
const styles = StyleSheet.create({
  page: { flexGrow: 1, paddingVertical: 24, paddingHorizontal: 16 },
  app: { width: "100%", maxWidth: 480, alignSelf: "center" },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 20 },
  summary: { flexDirection: "row", gap: 8, marginBottom: 20 },
  card: { flex: 1, borderWidth: 1, borderRadius: 12, padding: 12, gap: 4 },
  cardLabel: { fontSize: 12 },
  cardValue: { fontSize: 19, fontWeight: "600" },
  form: { flexDirection: "row", gap: 8 },
  input: { borderWidth: 1, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12, fontSize: 16, minWidth: 0 },
  itemInput: { flex: 2 },
  priceInput: { flex: 1 },
  button: { borderRadius: 8, paddingHorizontal: 16, justifyContent: "center" },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  error: { fontSize: 13, minHeight: 18, marginVertical: 6 },
  budgetRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  budgetInput: { width: 80, paddingVertical: 6 },
  empty: { textAlign: "center", marginTop: 24 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  rowItem: { flex: 1, fontSize: 16 },
  rowPrice: { fontWeight: "600", fontSize: 16 },
  delete: { paddingHorizontal: 8, paddingVertical: 4 },
});
