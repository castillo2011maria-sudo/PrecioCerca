import React, { useMemo, useState } from "react";
import {
  SafeAreaView, View, Text, TextInput, ScrollView, Pressable,
  StyleSheet, StatusBar, Alert, KeyboardAvoidingView, Platform
} from "react-native";

const INITIAL_BUSINESSES = [
  { id: "maria", name: "Despensa María" },
  { id: "norte", name: "Supermercado Norte" },
  { id: "jose", name: "Almacén Don José" },
];

const INITIAL_PRODUCTS = [
  { id: "1", name: "Yerba", prices: { maria: 4800, norte: 5200, jose: 4500 } },
  { id: "2", name: "Leche", prices: { maria: 1500, norte: 1700, jose: 1600 } },
  { id: "3", name: "Pan", prices: { maria: 2200, norte: 2100, jose: 2300 } },
  { id: "4", name: "Azúcar", prices: { maria: 1300, norte: 1450, jose: 1250 } },
  { id: "5", name: "Aceite", prices: { maria: 3100, norte: 2950, jose: 3200 } },
  { id: "6", name: "Arroz", prices: { maria: 1800, norte: 1750, jose: 1900 } },
];

const money = (value) =>
  "$ " + Number(value || 0).toLocaleString("es-AR", { maximumFractionDigits: 0 });

export default function App() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [businesses] = useState(INITIAL_BUSINESSES);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("1");
  const [priceBusiness, setPriceBusiness] = useState("maria");
  const [priceInput, setPriceInput] = useState("");
  const [newName, setNewName] = useState("");
  const [newPrices, setNewPrices] = useState({ maria: "", norte: "", jose: "" });
  const [showAdd, setShowAdd] = useState(false);
  const [cart, setCart] = useState({});

  const filteredProducts = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase())),
    [products, search]
  );

  const selectedProduct = products.find((p) => p.id === selectedId) || filteredProducts[0] || null;

  const rankedPrices = selectedProduct
    ? businesses
        .map((b) => ({ ...b, price: Number(selectedProduct.prices[b.id]) }))
        .filter((b) => Number.isFinite(b.price) && b.price > 0)
        .sort((a, b) => a.price - b.price)
    : [];

  const cheapest = rankedPrices[0];

  const cartTotals = businesses.map((business) => {
    const total = products.reduce((sum, product) => {
      const quantity = Number(cart[product.id] || 0);
      const price = Number(product.prices[business.id] || 0);
      return sum + quantity * price;
    }, 0);
    return { ...business, total };
  }).filter((b) => b.total > 0).sort((a, b) => a.total - b.total);

  const cartCount = Object.values(cart).reduce((sum, q) => sum + Number(q || 0), 0);

  function selectProduct(product) {
    setSelectedId(product.id);
    setPriceInput("");
  }

  function updatePrice() {
    const value = Number(priceInput.replace(",", "."));
    if (!selectedProduct) return Alert.alert("Seleccioná un producto", "Primero elegí un producto de la lista.");
    if (!Number.isFinite(value) || value <= 0) return Alert.alert("Precio inválido", "Ingresá un precio mayor que cero.");
    setProducts((current) => current.map((p) =>
      p.id === selectedProduct.id
        ? { ...p, prices: { ...p.prices, [priceBusiness]: value } }
        : p
    ));
    setPriceInput("");
    Alert.alert("Precio actualizado", "El nuevo precio se guardó en la aplicación.");
  }

  function addProduct() {
    const name = newName.trim();
    if (!name) return Alert.alert("Falta el nombre", "Escribí el nombre del producto.");
    const prices = {};
    for (const business of businesses) {
      const raw = String(newPrices[business.id] || "").trim();
      const value = raw ? Number(raw.replace(",", ".")) : 0;
      if (raw && (!Number.isFinite(value) || value <= 0)) {
        return Alert.alert("Precio inválido", `Revisá el precio de ${business.name}.`);
      }
      prices[business.id] = value;
    }
    if (Object.values(prices).every((v) => v === 0)) {
      return Alert.alert("Faltan precios", "Ingresá al menos un precio para el producto.");
    }
    const product = { id: String(Date.now()), name, prices };
    setProducts((current) => [...current, product]);
    setSelectedId(product.id);
    setSearch("");
    setNewName("");
    setNewPrices({ maria: "", norte: "", jose: "" });
    setShowAdd(false);
    Alert.alert("Producto agregado", `${name} ya forma parte del listado.`);
  }

  function changeQuantity(productId, amount) {
    setCart((current) => {
      const next = Math.max(0, Number(current[productId] || 0) + amount);
      const updated = { ...current };
      if (next === 0) delete updated[productId];
      else updated[productId] = next;
      return updated;
    });
  }

  function setQuantity(productId, value) {
    const quantity = Math.max(0, Math.floor(Number(value) || 0));
    setCart((current) => {
      const updated = { ...current };
      if (quantity === 0) delete updated[productId];
      else updated[productId] = quantity;
      return updated;
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F7F5" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.logo}><Text style={styles.logoText}>$</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.brand}>PrecioCerca</Text>
              <Text style={styles.subtitle}>Compará. Elegí. Ahorrá.</Text>
            </View>
            <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{cartCount}</Text></View>
          </View>

          <View style={styles.hero}>
            <Text style={styles.heroEyebrow}>TU COMPRA, MÁS INTELIGENTE</Text>
            <Text style={styles.heroTitle}>Encontrá el mejor precio cerca tuyo.</Text>
            <Text style={styles.heroCopy}>Compará los precios de los negocios del barrio en un solo lugar.</Text>
            <View style={styles.heroStats}>
              <View><Text style={styles.statNumber}>{products.length}</Text><Text style={styles.statLabel}>Productos</Text></View>
              <View style={styles.statDivider} />
              <View><Text style={styles.statNumber}>{businesses.length}</Text><Text style={styles.statLabel}>Negocios</Text></View>
              <View style={styles.statDivider} />
              <View><Text style={styles.statNumber}>100%</Text><Text style={styles.statLabel}>Local</Text></View>
            </View>
          </View>

          <View style={styles.sectionHeading}>
            <View><Text style={styles.sectionTitle}>Buscar productos</Text><Text style={styles.sectionHint}>Encontrá y seleccioná un producto</Text></View>
            <Pressable style={styles.addButton} onPress={() => setShowAdd(!showAdd)}>
              <Text style={styles.addButtonText}>{showAdd ? "Cerrar" : "+ Agregar"}</Text>
            </Pressable>
          </View>

          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Ej.: yerba, leche, pan..."
              placeholderTextColor="#98A39C"
              style={styles.searchInput}
              autoCapitalize="none"
            />
            {search.length > 0 && <Pressable onPress={() => setSearch("")}><Text style={styles.clearText}>×</Text></Pressable>}
          </View>

          {showAdd && (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Nuevo producto</Text>
              <Text style={styles.fieldLabel}>Nombre del producto</Text>
              <TextInput value={newName} onChangeText={setNewName} placeholder="Ej.: Fideos" style={styles.input} />
              <Text style={styles.fieldLabel}>Precios por negocio (podés dejar alguno vacío)</Text>
              {businesses.map((b) => (
                <View key={b.id} style={styles.formRow}>
                  <Text style={styles.formBusiness}>{b.name}</Text>
                  <TextInput
                    value={newPrices[b.id]}
                    onChangeText={(v) => setNewPrices((old) => ({ ...old, [b.id]: v }))}
                    placeholder="$ 0"
                    keyboardType="decimal-pad"
                    style={[styles.input, styles.priceInput]}
                  />
                </View>
              ))}
              <Pressable style={styles.primaryButton} onPress={addProduct}><Text style={styles.primaryButtonText}>Guardar producto</Text></Pressable>
            </View>
          )}

          <View style={styles.productList}>
            {filteredProducts.map((product) => {
              const isSelected = selectedProduct?.id === product.id;
              const prices = businesses.map((b) => Number(product.prices[b.id] || 0)).filter((v) => v > 0);
              const low = prices.length ? Math.min(...prices) : null;
              return (
                <Pressable key={product.id} onPress={() => selectProduct(product)} style={[styles.productRow, isSelected && styles.productRowSelected]}>
                  <View style={styles.productIcon}><Text style={styles.productEmoji}>🛒</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productMeta}>{prices.length} precios disponibles</Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.lowPrice}>{low === null ? "Sin precio" : money(low)}</Text>
                    <Text style={styles.productMeta}>desde</Text>
                  </View>
                  <Text style={[styles.chevron, isSelected && styles.chevronSelected]}>›</Text>
                </Pressable>
              );
            })}
            {filteredProducts.length === 0 && <Text style={styles.emptyText}>No encontramos productos con ese nombre.</Text>}
          </View>

          {selectedProduct && (
            <View style={styles.detailCard}>
              <Text style={styles.sectionEyebrow}>COMPARACIÓN DE PRECIOS</Text>
              <Text style={styles.detailTitle}>{selectedProduct.name}</Text>
              <Text style={styles.sectionHint}>Precios registrados en cada negocio</Text>
              {rankedPrices.map((item, index) => (
                <View key={item.id} style={styles.priceRow}>
                  <View style={styles.rankCircle}><Text style={styles.rankText}>{index + 1}</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.businessName}>{item.name}</Text>
                    {index === 0 && <Text style={styles.bestLabel}>MEJOR PRECIO</Text>}
                  </View>
                  <Text style={[styles.priceValue, index === 0 && styles.bestPrice]}>{money(item.price)}</Text>
                </View>
              ))}
              {cheapest && (
                <View style={styles.winnerBox}>
                  <Text style={styles.winnerLabel}>✓ PRECIO MÁS BAJO</Text>
                  <Text style={styles.winnerName}>{cheapest.name}</Text>
                  <Text style={styles.winnerPrice}>{money(cheapest.price)}</Text>
                </View>
              )}
              <View style={styles.editDivider} />
              <Text style={styles.formTitle}>Actualizar un precio</Text>
              <Text style={styles.fieldLabel}>Elegí el negocio</Text>
              <View style={styles.chipWrap}>
                {businesses.map((b) => (
                  <Pressable key={b.id} onPress={() => setPriceBusiness(b.id)} style={[styles.chip, priceBusiness === b.id && styles.chipActive]}>
                    <Text style={[styles.chipText, priceBusiness === b.id && styles.chipTextActive]}>{b.name}</Text>
                  </Pressable>
                ))}
              </View>
              <Text style={styles.fieldLabel}>Nuevo precio ($)</Text>
              <View style={styles.updateRow}>
                <TextInput value={priceInput} onChangeText={setPriceInput} placeholder="Ej.: 2500" keyboardType="decimal-pad" style={[styles.input, { flex: 1 }]} />
                <Pressable style={styles.primaryButtonSmall} onPress={updatePrice}><Text style={styles.primaryButtonText}>Actualizar</Text></Pressable>
              </View>
              <Text style={styles.note}>El precio más bajo se vuelve a calcular automáticamente al actualizar.</Text>
            </View>
          )}

          <View style={styles.sectionHeading}>
            <View><Text style={styles.sectionTitle}>Mi lista de compras</Text><Text style={styles.sectionHint}>Elegí cantidades para comparar el total</Text></View>
            <Pressable onPress={() => setCart({})}><Text style={styles.clearCart}>Limpiar</Text></Pressable>
          </View>
          <View style={styles.cartCard}>
            {products.map((product) => (
              <View key={product.id} style={styles.cartRow}>
                <Text style={styles.cartProduct}>{product.name}</Text>
                <View style={styles.quantityControl}>
                  <Pressable style={styles.quantityButton} onPress={() => changeQuantity(product.id, -1)}><Text style={styles.quantityButtonText}>−</Text></Pressable>
                  <TextInput
                    value={String(cart[product.id] || 0)}
                    onChangeText={(v) => setQuantity(product.id, v)}
                    keyboardType="number-pad"
                    style={styles.quantityValue}
                  />
                  <Pressable style={styles.quantityButton} onPress={() => changeQuantity(product.id, 1)}><Text style={styles.quantityButtonText}>+</Text></Pressable>
                </View>
              </View>
            ))}
            {cartCount === 0 ? (
              <Text style={styles.emptyCart}>Todavía no agregaste productos. Usá + para armar tu compra.</Text>
            ) : (
              <View style={styles.totals}>
                <Text style={styles.formTitle}>Total de tu compra por negocio</Text>
                {cartTotals.map((b, index) => (
                  <View key={b.id} style={styles.totalRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.businessName}>{b.name}</Text>
                      {index === 0 && <Text style={styles.bestLabel}>COMPRA MÁS ECONÓMICA</Text>}
                    </View>
                    <Text style={[styles.totalValue, index === 0 && styles.bestPrice]}>{money(b.total)}</Text>
                  </View>
                ))}
                <Text style={styles.note}>El total suma cada producto por su cantidad. Los productos sin precio registrado en un negocio no aportan al total.</Text>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerBrand}>PrecioCerca</Text>
            <Text style={styles.footerText}>Proyecto académico · React Native + Expo</Text>
            <Text style={styles.footerText}>Datos de ejemplo almacenados localmente en la aplicación.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F7F5" },
  container: { padding: 18, paddingBottom: 38 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 18, gap: 11 },
  logo: { width: 44, height: 44, borderRadius: 14, backgroundColor: "#147D55", alignItems: "center", justifyContent: "center" },
  logoText: { color: "#FFFFFF", fontSize: 27, fontWeight: "900" },
  brand: { color: "#18352A", fontSize: 21, fontWeight: "900", letterSpacing: -0.5 },
  subtitle: { color: "#7B8981", fontSize: 12, marginTop: 1 },
  cartBadge: { width: 35, height: 35, borderRadius: 18, backgroundColor: "#E0F2E9", alignItems: "center", justifyContent: "center" },
  cartBadgeText: { color: "#147D55", fontWeight: "800" },
  hero: { backgroundColor: "#155F45", borderRadius: 22, padding: 21, marginBottom: 25 },
  heroEyebrow: { color: "#A9E5C9", fontSize: 10, fontWeight: "800", letterSpacing: 1.5, marginBottom: 10 },
  heroTitle: { color: "#FFFFFF", fontSize: 27, lineHeight: 32, fontWeight: "900", maxWidth: 300 },
  heroCopy: { color: "#D5E9DF", fontSize: 13, lineHeight: 19, marginTop: 9, maxWidth: 300 },
  heroStats: { flexDirection: "row", alignItems: "center", marginTop: 22, gap: 18 },
  statNumber: { color: "#FFFFFF", fontSize: 19, fontWeight: "900" },
  statLabel: { color: "#B9D8C9", fontSize: 10, marginTop: 2 },
  statDivider: { height: 30, width: 1, backgroundColor: "#4C8C70" },
  sectionHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12, marginTop: 2 },
  sectionTitle: { color: "#20372D", fontSize: 18, fontWeight: "900" },
  sectionHint: { color: "#849189", fontSize: 11, marginTop: 3 },
  addButton: { backgroundColor: "#E1F2E9", paddingHorizontal: 13, paddingVertical: 9, borderRadius: 10 },
  addButtonText: { color: "#147D55", fontWeight: "800", fontSize: 12 },
  searchBox: { backgroundColor: "#FFFFFF", borderRadius: 13, borderWidth: 1, borderColor: "#E5EBE7", flexDirection: "row", alignItems: "center", paddingHorizontal: 13, marginBottom: 12, height: 49 },
  searchIcon: { color: "#7C8A81", fontSize: 25, marginRight: 8 },
  searchInput: { flex: 1, color: "#20372D", fontSize: 14, paddingVertical: 8 },
  clearText: { color: "#849189", fontSize: 23, paddingHorizontal: 5 },
  productList: { backgroundColor: "#FFFFFF", borderRadius: 16, paddingHorizontal: 13, borderWidth: 1, borderColor: "#E9EEEB", marginBottom: 23 },
  productRow: { flexDirection: "row", alignItems: "center", paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: "#F0F3F1", gap: 10 },
  productRowSelected: { backgroundColor: "#F0F8F3", marginHorizontal: -13, paddingHorizontal: 13, borderRadius: 12 },
  productIcon: { width: 39, height: 39, borderRadius: 12, backgroundColor: "#F1F5F2", alignItems: "center", justifyContent: "center" },
  productEmoji: { fontSize: 19 },
  productName: { color: "#263B31", fontWeight: "800", fontSize: 14 },
  productMeta: { color: "#98A39C", fontSize: 10, marginTop: 3 },
  lowPrice: { color: "#147D55", fontWeight: "900", fontSize: 14 },
  chevron: { color: "#B3BDB7", fontSize: 24, marginLeft: 1 },
  chevronSelected: { color: "#147D55" },
  emptyText: { color: "#849189", textAlign: "center", padding: 20, fontSize: 13 },
  detailCard: { backgroundColor: "#FFFFFF", borderRadius: 18, padding: 17, borderWidth: 1, borderColor: "#E7EDE9", marginBottom: 25 },
  sectionEyebrow: { color: "#16845A", fontSize: 10, letterSpacing: 1.4, fontWeight: "900" },
  detailTitle: { color: "#20372D", fontSize: 23, fontWeight: "900", marginTop: 5 },
  priceRow: { flexDirection: "row", alignItems: "center", paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: "#F0F3F1", gap: 10 },
  rankCircle: { width: 27, height: 27, borderRadius: 14, backgroundColor: "#F0F4F1", alignItems: "center", justifyContent: "center" },
  rankText: { color: "#65736A", fontSize: 11, fontWeight: "800" },
  businessName: { color: "#33483D", fontSize: 12, fontWeight: "700" },
  bestLabel: { color: "#16845A", fontSize: 8, fontWeight: "900", letterSpacing: 0.8, marginTop: 3 },
  priceValue: { color: "#354A3F", fontSize: 15, fontWeight: "800" },
  bestPrice: { color: "#128253" },
  winnerBox: { backgroundColor: "#EAF6EF", borderRadius: 13, padding: 14, marginTop: 14 },
  winnerLabel: { color: "#16845A", fontSize: 9, fontWeight: "900", letterSpacing: 1 },
  winnerName: { color: "#234C39", fontSize: 14, fontWeight: "800", marginTop: 5 },
  winnerPrice: { color: "#147D55", fontSize: 24, fontWeight: "900", marginTop: 2 },
  editDivider: { height: 1, backgroundColor: "#E9EFEB", marginVertical: 18 },
  formCard: { backgroundColor: "#FFFFFF", padding: 16, borderRadius: 16, borderWidth: 1, borderColor: "#E7EDE9", marginBottom: 15 },
  formTitle: { color: "#263B31", fontSize: 15, fontWeight: "900", marginBottom: 12 },
  fieldLabel: { color: "#65736A", fontSize: 11, fontWeight: "700", marginTop: 9, marginBottom: 6 },
  input: { backgroundColor: "#F7F9F7", borderWidth: 1, borderColor: "#E3EAE5", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: "#20372D", fontSize: 13 },
  formRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 7 },
  formBusiness: { color: "#43554B", fontSize: 11, flex: 1 },
  priceInput: { width: 110, textAlign: "right" },
  primaryButton: { backgroundColor: "#147D55", borderRadius: 11, alignItems: "center", padding: 13, marginTop: 15 },
  primaryButtonSmall: { backgroundColor: "#147D55", borderRadius: 10, alignItems: "center", justifyContent: "center", paddingHorizontal: 14, minHeight: 43 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  chip: { borderRadius: 20, borderWidth: 1, borderColor: "#DDE6E0", paddingVertical: 8, paddingHorizontal: 10, backgroundColor: "#FFFFFF" },
  chipActive: { backgroundColor: "#E6F4EC", borderColor: "#147D55" },
  chipText: { color: "#6D7A72", fontSize: 10, fontWeight: "700" },
  chipTextActive: { color: "#147D55" },
  updateRow: { flexDirection: "row", gap: 8 },
  note: { color: "#929D96", fontSize: 10, lineHeight: 15, marginTop: 9 },
  clearCart: { color: "#147D55", fontSize: 12, fontWeight: "800" },
  cartCard: { backgroundColor: "#FFFFFF", borderRadius: 16, borderWidth: 1, borderColor: "#E7EDE9", paddingHorizontal: 14, paddingTop: 4, paddingBottom: 14 },
  cartRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: "#F0F3F1" },
  cartProduct: { color: "#33483D", fontSize: 13, fontWeight: "700", flex: 1 },
  quantityControl: { flexDirection: "row", alignItems: "center", gap: 7 },
  quantityButton: { width: 27, height: 27, borderRadius: 8, backgroundColor: "#EAF4ED", alignItems: "center", justifyContent: "center" },
  quantityButtonText: { color: "#147D55", fontSize: 18, fontWeight: "800", lineHeight: 21 },
  quantityValue: { color: "#263B31", minWidth: 25, textAlign: "center", fontWeight: "800", padding: 0, fontSize: 13 },
  emptyCart: { color: "#929D96", fontSize: 11, lineHeight: 17, paddingVertical: 14 },
  totals: { paddingTop: 16 },
  totalRow: { flexDirection: "row", alignItems: "center", paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: "#F0F3F1" },
  totalValue: { color: "#354A3F", fontSize: 15, fontWeight: "900" },
  footer: { alignItems: "center", paddingTop: 28, paddingBottom: 5 },
  footerBrand: { color: "#147D55", fontWeight: "900", fontSize: 14 },
  footerText: { color: "#9AA59E", fontSize: 10, marginTop: 4, textAlign: "center" },
});
