import api from "./api";

/* =========================
   ACTIVIDADES POR CAMPAÑA
========================= */
export const getActivitiesByCampaign = async (campaignId) => {
  try {
    const res = await api.get(`/campaigns/${campaignId}/activities/`);
    return res.data;
  } catch (error) {
    console.error("Error obteniendo actividades:", error);
    return [];
  }
};

/* =========================
   CREAR ACTIVIDAD
========================= */
export const createActivity = async (campaignId, data) => {
  try {
    const res = await api.post(
      `/campaigns/${campaignId}/activities/`,
      data
    );
    return res.data;
  } catch (error) {
    console.error("Error creando actividad:", error);
    return { error: true };
  }
};

/* =========================
   ACTUALIZAR ACTIVIDAD
========================= */
export const updateActivity = async (activityId, data) => {
  try {
    const res = await api.put(
      `/activities/${activityId}/`,
      data
    );
    return res.data;
  } catch (error) {
    console.error("Error actualizando actividad:", error);
    return { error: true };
  }
};

/* =========================
   ELIMINAR ACTIVIDAD
========================= */
export const deleteActivity = async (activityId) => {
  try {
    const res = await api.delete(`/activities/${activityId}/`);
    return res.data;
  } catch (error) {
    console.error("Error eliminando actividad:", error);
    return { error: true };
  }
};

/* =========================
   UBICACIÓN DE ACTIVIDAD
========================= */

/* obtener location */
export const getActivityLocation = async (activityId) => {
  try {
    const res = await api.get(`/activities/${activityId}/location/`);
    return res.data;
  } catch (error) {
    return null; // si no existe
  }
};

/* crear location */
export const createActivityLocation = async (activityId, data) => {
  try {
    const res = await api.post(
      `/activities/${activityId}/location/`,
      data
    );
    return res.data;
  } catch (error) {
    console.error("Error creando ubicación:", error);
    return { error: true };
  }
};

/* actualizar location */
export const updateActivityLocation = async (activityId, data) => {
  try {
    const res = await api.put(
      `/activities/${activityId}/location/`,
      data
    );
    return res.data;
  } catch (error) {
    console.error("Error actualizando ubicación:", error);
    return { error: true };
  }
};